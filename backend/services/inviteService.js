// services/inviteService.js
const crypto = require('crypto');
const Invite = require('../models/Invite');

/* ---------------- URL Helpers ---------------- */
const stripTrailingSlash = (u) => (u ? u.replace(/\/+$/, '') : '');
const stripLeadingSlash = (u) => (u ? u.replace(/^\/+/, '') : '');
const joinUrl = (base, path) =>
  `${stripTrailingSlash(base)}/${stripLeadingSlash(path || '')}`;

function resolveClientUrl() {
  const direct = process.env.CLIENT_URL || process.env.PUBLIC_CLIENT_URL;
  if (direct && direct.trim()) return stripTrailingSlash(direct.trim());

  const list = process.env.CLIENT_URLS;
  if (list && list.trim()) {
    const first = list.split(',')[0].trim();
    if (first) return stripTrailingSlash(first);
  }
  return '';
}

function resolveBackendUrl() {
  return stripTrailingSlash(
    process.env.PUBLIC_API_BASE ||
      process.env.API_BASE ||
      process.env.RENDER_EXTERNAL_URL ||
      'http://localhost:5000'
  );
}

/* ---------------- Core Helpers ---------------- */
function generateRawToken(bytes = 32) {
  // URL-safe (hex) raw token; DB'ye yalnızca SHA-256 hash yazılır
  return crypto.randomBytes(bytes).toString('hex');
}

// İnsan okunur süre -> Date (null = süresiz)
function computeExpiresAt({ minutes, hours, days } = {}) {
  const ms =
    (Number(minutes) || 0) * 60 * 1000 +
    (Number(hours) || 0) * 60 * 60 * 1000 +
    (Number(days) || 0) * 24 * 60 * 60 * 1000;
  return ms > 0 ? new Date(Date.now() + ms) : null;
}

function normalizeRemainingUses(v) {
  // 0 => sınırsız; negatifleri 0'a çekme; NaN -> 1
  if (v === undefined || v === null) return 1;
  const n = Number(v);
  if (!Number.isFinite(n)) return 1;
  return Math.max(0, Math.floor(n));
}

function inferInviteType(inviteType, channelId) {
  if (inviteType === 'server' || inviteType === 'channel') return inviteType;
  return channelId ? 'channel' : 'server';
}

function buildInviteUrl(rawToken) {
  const client = resolveClientUrl();
  const backend = resolveBackendUrl();
  // Öncelik: client SPA invite sayfası; yoksa backend redeem endpoint’i
  return client
    ? joinUrl(client, `invite?token=${encodeURIComponent(rawToken)}`)
    : joinUrl(backend, `api/invites/redeem?token=${encodeURIComponent(rawToken)}`);
}

/* ---------------- Public API ---------------- */
/**
 * Invite oluşturur: rawToken üretir, Invite'ı kaydeder, kullanılabilir URL döner.
 * @param {Object} args
 * @param {ObjectId|String} args.serverId (zorunlu)
 * @param {ObjectId|String|null} args.channelId
 * @param {'server'|'channel'} [args.inviteType]
 * @param {number} [args.remainingUses] 0=sınırsız, >0=kullanım sayısı
 * @param {{minutes?:number,hours?:number,days?:number}} [args.expires] default {days:7}
 * @param {ObjectId|String|null} [args.createdBy]
 * @returns {Promise<{rawToken:string, invite:any, url:string}>}
 */
async function createInvite({
  serverId,
  channelId = null,
  inviteType,
  remainingUses,
  expires = { days: 7 },
  createdBy = null,
}) {
  if (!serverId) throw new Error('serverId is required');

  const rawToken = generateRawToken(32);
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

  const doc = await Invite.create({
    tokenHash,
    serverId,
    channelId: channelId || null,
    inviteType: inferInviteType(inviteType, channelId),
    createdBy: createdBy || null,
    expiresAt: computeExpiresAt(expires),
    remainingUses: normalizeRemainingUses(remainingUses),
  });

  const url = buildInviteUrl(rawToken);

  return {
    rawToken,
    invite: typeof doc.toPublic === 'function' ? doc.toPublic() : doc,
    url,
  };
}

module.exports = {
  createInvite,
};
