// src/pages/admin/AdminDashboard.tsx
// Admin panel — members, renewals, notifications, trial requests

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase/config';
import {
getAllMembers, markAsPaid, processRenewal, deleteMember, deleteRenewalRequest, deleteAdminNotification,  getRenewalRequests, getTrialRequests, markTrialContacted,
  getAdminNotifications, markNotificationRead,
  getRenewalWhatsAppLink, daysUntilExpiry,
} from '../../firebase/db';
import { BOXING_PLANS, NISHA_PLANS } from '../../constants/plans';
import type { Member, TrialRequest, AdminNotification } from '../../types';

type Tab = 'all' | 'boxing' | 'nisha' | 'renewals' | 'trials' | 'notifications';

export default function AdminDashboard() {
  const [loggedIn,       setLoggedIn]       = useState(false);
  const [email,          setEmail]          = useState('');
  const [password,       setPassword]       = useState('');
  const [loginError,     setLoginError]     = useState('');
  const [members,        setMembers]        = useState<Member[]>([]);
  const [trials,         setTrials]         = useState<TrialRequest[]>([]);
  const [renewalReqs,    setRenewalReqs]    = useState<Awaited<ReturnType<typeof getRenewalRequests>>>([]);
  const [notifications,  setNotifications]  = useState<AdminNotification[]>([]);
  const [tab,            setTab]            = useState<Tab>('all');
  const [search,         setSearch]         = useState('');
  const [loading,        setLoading]        = useState(false);
  const [unreadCount,    setUnreadCount]    = useState(0);

  // Renewal modal state
  const [renewModal,   setRenewModal]   = useState<{ uid: string; name: string } | null>(null);
  const [renewPlanId,  setRenewPlanId]  = useState('');
  const [renewNote,    setRenewNote]    = useState('');
  const [renewLoading, setRenewLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      setLoggedIn(!!user);
      if (user) loadData();
    });
    return unsub;
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [m, t, r, n] = await Promise.all([
        getAllMembers(), getTrialRequests(), getRenewalRequests(), getAdminNotifications(),
      ]);
      setMembers(m); setTrials(t); setRenewalReqs(r); setNotifications(n);
      setUnreadCount(n.filter(x => !x.read).length);
    } finally { setLoading(false); }
  }

  async function handleLogin() {
    setLoginError('');
    try { await signInWithEmailAndPassword(auth, email, password); }
    catch { setLoginError('Invalid email or password'); }
  }

  async function handleRenewal() {
    if (!renewModal || !renewPlanId) return;
    setRenewLoading(true);
    const allPlans = [...BOXING_PLANS, ...NISHA_PLANS];
    const plan = allPlans.find(p => p.id === renewPlanId);
    if (!plan) return;
    try {
      await processRenewal(renewModal.uid, plan.id, plan.name, plan.price, plan.durationDays, renewNote || undefined);
      setRenewModal(null); setRenewPlanId(''); setRenewNote('');
      await loadData();
    } finally { setRenewLoading(false); }
  }

  function exportToCSV() {
    const rows = [
      ['ID', 'Name', 'Phone', 'Age', 'Gender', 'Gym', 'Plan', 'Join Date', 'Expiry', 'Payment', 'Days Left'],
      ...filteredMembers.map(m => [
        m.membershipId, m.name, m.phone, m.age, m.gender ?? '',
        m.gym, m.planName,
        new Date(m.joinDate).toLocaleDateString('en-IN'),
        new Date(m.expiryDate).toLocaleDateString('en-IN'),
        m.paymentStatus,
        daysUntilExpiry(m).toString(),
      ]),
    ];
    const csv  = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `members-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  }

  const filteredMembers = members.filter(m => {
    const gymMatch = tab === 'all' || tab === m.gym;
    const searchMatch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search) ||
      m.membershipId.toLowerCase().includes(search.toLowerCase());
    return gymMatch && searchMatch;
  });

  const stats = {
    total: members.length,
    boxing: members.filter(m => m.gym === 'boxing').length,
    nisha: members.filter(m => m.gym === 'nisha').length,
    expiringSoon: members.filter(m => { const d = daysUntilExpiry(m); return d >= 0 && d <= 7; }).length,
    expired: members.filter(m => daysUntilExpiry(m) < 0).length,
    pending: members.filter(m => m.paymentStatus === 'pending').length,
    renewalRequests: renewalReqs.length,
  };

  // ── LOGIN ──
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center font-body">
        <div className="w-full max-w-sm bg-gray-900 border border-white/10 rounded-lg p-8">
          <h1 className="text-white font-boxing font-bold uppercase text-2xl mb-1">Admin Panel</h1>
          <p className="text-white/40 text-sm mb-6">Gym Management Dashboard</p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin email"
            className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none mb-3" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="w-full bg-white/5 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none mb-4" />
          {loginError && <p className="text-red-400 text-sm mb-3">{loginError}</p>}
          <button onClick={handleLogin} className="w-full py-3 bg-red-700 text-white font-bold uppercase tracking-widest text-sm hover:bg-red-600 transition-all">Login</button>
        </div>
      </div>
    );
  }

  const isRenewableMember = (uid: string) => {
    const m = members.find(x => x.uid === uid);
    return m ?? null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white font-body">
      {/* Top bar */}
      <div className="bg-gray-900 border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <h1 className="font-boxing font-bold uppercase tracking-wider">Gym Admin</h1>
        <div className="flex gap-3 items-center">
          <button onClick={loadData} className="text-white/50 text-sm hover:text-white">↻ Refresh</button>
          <button onClick={exportToCSV} className="text-xs px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded font-semibold">Export CSV</button>
          <button onClick={() => signOut(auth)} className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded">Logout</button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
          {[
            { label: 'Total',      value: stats.total,           color: 'text-white' },
            { label: 'Boxing',     value: stats.boxing,          color: 'text-red-400' },
            { label: 'Nisha',      value: stats.nisha,           color: 'text-pink-400' },
            { label: 'Expiring 7d',value: stats.expiringSoon,    color: 'text-amber-400' },
            { label: 'Expired',    value: stats.expired,         color: 'text-red-500' },
            { label: 'Pending Pay',value: stats.pending,         color: 'text-orange-400' },
            { label: '🔄 Renewals',value: stats.renewalRequests, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 border border-white/10 rounded p-3">
              <p className="text-white/40 text-xs mb-1">{s.label}</p>
              <p className={`font-boxing font-bold text-2xl ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4 flex-wrap items-center">
          {([
            { key: 'all',           label: 'All Members' },
            { key: 'boxing',        label: 'Boxing Club' },
            { key: 'nisha',         label: 'Nisha Fitness' },
            { key: 'renewals',      label: `🔄 Renewals ${renewalReqs.length > 0 ? `(${renewalReqs.length})` : ''}` },
            { key: 'trials',        label: 'Trial Requests' },
            { key: 'notifications', label: `🔔 Alerts ${unreadCount > 0 ? `(${unreadCount})` : ''}` },
          ] as const).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-semibold rounded transition-all ${
                tab === t.key ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}>
              {t.label}
            </button>
          ))}
          {(tab === 'all' || tab === 'boxing' || tab === 'nisha') && (
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, phone, ID..."
              className="ml-auto bg-white/5 border border-white/20 rounded px-4 py-1.5 text-white text-sm placeholder-white/30 focus:outline-none w-64" />
          )}
        </div>

        {loading && <p className="text-white/40 text-sm py-4">Loading...</p>}

        {/* ── MEMBERS TABLE ── */}
        {(tab === 'all' || tab === 'boxing' || tab === 'nisha') && !loading && (
          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white/40 text-xs uppercase tracking-widest">
                  {['ID', 'Name', 'Phone', 'Age', 'Gym', 'Plan', 'Expiry', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(m => {
                  const days = daysUntilExpiry(m);
                  const rowBg = days < 0 ? 'bg-red-950/30' : days <= 7 ? 'bg-amber-950/30' : '';
                  return (
                    <tr key={m.uid} className={`border-t border-white/5 hover:bg-white/5 ${rowBg}`}>
                      <td className="px-4 py-3 font-mono text-xs text-white/60">{m.membershipId}</td>
                      <td className="px-4 py-3 text-white font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-white/60">{m.phone}</td>
                      <td className="px-4 py-3 text-white/60">{m.age}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${m.gym === 'boxing' ? 'bg-red-900/60 text-red-300' : 'bg-pink-900/60 text-pink-300'}`}>
                          {m.gym === 'boxing' ? 'Boxing' : 'Nisha'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70">{m.planName}</td>
                      <td className="px-4 py-3">
                        <div className="text-white/70 text-xs">{new Date(m.expiryDate).toLocaleDateString('en-IN')}</div>
                        <div className={`text-xs font-semibold ${days < 0 ? 'text-red-400' : days <= 7 ? 'text-amber-400' : 'text-green-400'}`}>
                          {days < 0 ? `Expired ${Math.abs(days)}d ago` : days === 0 ? 'Today' : `${days}d left`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${m.paymentStatus === 'paid' ? 'bg-green-900/60 text-green-300' : 'bg-orange-900/60 text-orange-300'}`}>
                          {m.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {m.paymentStatus !== 'paid' && (
                            <button onClick={async () => { await markAsPaid(m.uid); await loadData(); }}
                              className="text-xs px-2 py-1 bg-green-700 hover:bg-green-600 text-white rounded">
                              Mark Paid
                            </button>
                          )}
                          <button onClick={() => setRenewModal({ uid: m.uid, name: m.name })}
                            className="text-xs px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded">
                            Renew
                          </button>
                          {days <= 7 && (
                            <a href={getRenewalWhatsAppLink(m)} target="_blank" rel="noopener noreferrer"
                              className="text-xs px-2 py-1 bg-green-600/20 hover:bg-green-600/40 text-green-300 border border-green-600/40 rounded">
                              WA Remind
                            </a>
                          )}
                          <button onClick={async () => {
                              if (!confirm(`Delete ${m.name} (${m.membershipId})? This removes them from the dashboard and sheet. If they need to re-register later, you must also delete their account from Firebase Console → Authentication.`)) return;
                              await deleteMember(m.uid);
                              await loadData();
                            }}
                            className="text-xs px-2 py-1 bg-red-900/60 hover:bg-red-700 text-red-200 border border-red-700/50 rounded">
                            Delete
                          </button>
                          </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredMembers.length === 0 && (
                  <tr><td colSpan={9} className="px-4 py-8 text-center text-white/30">No members found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── RENEWAL REQUESTS ── */}
        {tab === 'renewals' && !loading && (
          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white/40 text-xs uppercase tracking-widest">
                  {['Member', 'Gym', 'Plan Requested', 'Amount', 'Requested At', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {renewalReqs.map(r => {
                  const m = isRenewableMember(r.uid);
                  return (
                    <tr key={r.id} className="border-t border-white/5 hover:bg-white/5 bg-amber-950/20">
                      <td className="px-4 py-3">
                        <div className="text-white font-medium">{m?.name ?? r.uid.slice(0,8)}</div>
                        <div className="text-white/40 text-xs">{m?.membershipId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${m?.gym === 'boxing' ? 'bg-red-900/60 text-red-300' : 'bg-pink-900/60 text-pink-300'}`}>
                          {m?.gym === 'boxing' ? 'Boxing' : 'Nisha'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white/70">{r.planName}</td>
                      <td className="px-4 py-3 font-boxing font-bold text-green-400">₹{r.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{new Date(r.submittedAt).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <div className="space-y-1">
                          {(r as any).transactionId && (
                            <p className="text-xs font-mono text-yellow-300 bg-yellow-900/30 px-2 py-0.5 rounded">
                              UTR: {(r as any).transactionId}
                            </p>
                          )}
                          <button onClick={() => setRenewModal({ uid: r.uid, name: m?.name ?? 'Member' })}
                            className="text-xs px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white rounded font-semibold">
                            ✓ Approve & Renew
                          </button>
                          <button onClick={async () => {
    if (!confirm('Delete this renewal request?')) return;
    await deleteRenewalRequest(r.id);
    await loadData();
  }}
  className="text-xs px-2 py-1 bg-red-900/60 hover:bg-red-700 text-red-200 border border-red-700/50 rounded ml-2">
  Delete
</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {renewalReqs.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">No pending renewal requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TRIAL REQUESTS ── */}
        {tab === 'trials' && !loading && (
          <div className="overflow-x-auto rounded border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-900 text-white/40 text-xs uppercase tracking-widest">
                  {['Name', 'Phone', 'Gym', 'Preferred Time', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trials.map(t => (
                  <tr key={t.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 text-white">{t.name}</td>
                    <td className="px-4 py-3">
                      <a href={`https://wa.me/${t.phone.replace('+','')}?text=Hi ${t.name}, regarding your trial at ${t.gym === 'boxing' ? 'Fitness First Boxing Club' : 'Nisha Fitness'}.`}
                        target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">{t.phone}</a>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${t.gym === 'boxing' ? 'bg-red-900/60 text-red-300' : 'bg-pink-900/60 text-pink-300'}`}>{t.gym}</span>
                    </td>
                    <td className="px-4 py-3 text-white/70">{t.preferredTime}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{new Date(t.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3">
                      {t.contacted ? (
                        <span className="text-xs px-2 py-0.5 bg-green-900/60 text-green-300 rounded">Contacted</span>
                      ) : (
                        <button onClick={async () => { if (t.id) { await markTrialContacted(t.id); await loadData(); } }}
                          className="text-xs px-2 py-1 bg-blue-800 hover:bg-blue-700 text-white rounded">
                          Mark Contacted
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {trials.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-white/30">No trial requests yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── NOTIFICATIONS ── */}
        {tab === 'notifications' && !loading && (
          <div className="space-y-3 max-w-2xl">
            {notifications.map(n => (
              <div key={n.id} onClick={async () => { if (!n.read && n.id) { await markNotificationRead(n.id); setUnreadCount(c => Math.max(0, c - 1)); setNotifications(prev => prev.map(x => x.id === n.id ? {...x, read: true} : x)); }}}
                className={`border rounded p-4 cursor-pointer transition-all ${n.read ? 'border-white/10 bg-white/2 opacity-60' : 'border-white/20 bg-white/5 hover:bg-white/8'}`}>
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="text-white text-sm font-semibold whitespace-pre-line">{n.message}</p>
                    <p className="text-white/30 text-xs mt-1">{new Date(n.createdAt).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${n.gym === 'boxing' ? 'bg-red-900/60 text-red-300' : 'bg-pink-900/60 text-pink-300'}`}>
                      {n.gym === 'boxing' ? 'Boxing' : 'Nisha'}
                    </span>
                    <button onClick={async (e) => {
    e.stopPropagation();
    if (!confirm('Delete this notification?')) return;
    await deleteAdminNotification(n.id!);
    await loadData();
  }}
  className="text-xs px-2 py-1 bg-red-900/60 hover:bg-red-700 text-red-200 border border-red-700/50 rounded">
  Delete
</button>
                    {!n.read && <span className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && <p className="text-white/30 text-sm py-8 text-center">No notifications yet</p>}
          </div>
        )}
      </div>

      {/* ── RENEWAL MODAL ── */}
      {renewModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 w-full max-w-sm">
            <h3 className="font-boxing font-bold uppercase text-xl text-white mb-1">Process Renewal</h3>
            <p className="text-white/50 text-sm mb-5">Member: <span className="text-white font-semibold">{renewModal.name}</span></p>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Select New Plan</label>
                <select value={renewPlanId} onChange={e => setRenewPlanId(e.target.value)}
                  className="w-full bg-gray-800 border border-white/20 rounded px-4 py-3 text-white focus:outline-none">
                  <option value="">Choose plan...</option>
                  {(() => {
                    const m = members.find(x => x.uid === renewModal.uid);
                    const plans = m?.gym === 'boxing' ? BOXING_PLANS : NISHA_PLANS;
                    return plans.filter(p => !p.isPersonalTraining).map(p => (
                      <option key={p.id} value={p.id}>{p.name} — ₹{p.price.toLocaleString('en-IN')}</option>
                    ));
                  })()}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Note (optional)</label>
                <input type="text" value={renewNote} onChange={e => setRenewNote(e.target.value)}
                  placeholder="e.g. Cash payment received"
                  className="w-full bg-gray-800 border border-white/20 rounded px-4 py-3 text-white placeholder-white/30 focus:outline-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setRenewModal(null); setRenewPlanId(''); setRenewNote(''); }}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded transition-all">
                  Cancel
                </button>
                <button onClick={handleRenewal} disabled={!renewPlanId || renewLoading}
                  className="flex-1 py-3 bg-green-700 hover:bg-green-600 text-white font-bold text-sm uppercase rounded transition-all disabled:opacity-50">
                  {renewLoading ? 'Processing...' : '✓ Confirm Renewal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
