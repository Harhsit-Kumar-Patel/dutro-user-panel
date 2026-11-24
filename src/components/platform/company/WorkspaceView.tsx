import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  INITIAL_WORKSPACE_CHANNELS,
  INITIAL_WORKSPACE_MESSAGES,
  INITIAL_GLOBAL_CONTROLS,
} from '../../../data/platformMockData';
import { WorkspaceChannel, WorkspaceMessage } from '../../../types/platform';
import {
  Hash,
  Lock,
  Plus,
  Send,
  Paperclip,
  Search,
  FileText,
  Image,
  ExternalLink,
  CheckCircle2,
  X,
  MessageSquare,
  Shield,
  Smile,
  AtSign,
} from 'lucide-react';

export const WorkspaceView: React.FC = () => {
  const { currentRole } = useApp();

  const [channels, setChannels] = useState<WorkspaceChannel[]>(INITIAL_WORKSPACE_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('chan-dept-analytics');
  const [messages, setMessages] = useState<WorkspaceMessage[]>(INITIAL_WORKSPACE_MESSAGES);
  const [newMessageText, setNewMessageText] = useState('');

  // Modals & Drawers
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [newChannelForm, setNewChannelForm] = useState({
    name: '',
    purpose: '',
    isPrivate: false,
  });

  // Document preview & Map as Evidence modal
  const [previewAttachment, setPreviewAttachment] = useState<{
    name: string;
    size: string;
    fileType: string;
    linkedControlId?: string;
  } | null>(null);
  const [isMappingEvidence, setIsMappingEvidence] = useState(false);
  const [selectedControlForMap, setSelectedControlForMap] = useState('1.1.1');
  const [evidenceMappedSuccess, setEvidenceMappedSuccess] = useState(false);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSendMessage = () => {
    if (!newMessageText.trim()) return;

    const newMsg: WorkspaceMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderName: `${currentRole} User`,
      senderRole: currentRole,
      senderEmail: 'user@dutro.ai',
      timestamp: 'Just now',
      text: newMessageText,
    };

    setMessages([...messages, newMsg]);
    setNewMessageText('');
  };

  const handleAttachSimulatedDoc = () => {
    const newMsg: WorkspaceMessage = {
      id: `msg-${Date.now()}`,
      channelId: activeChannelId,
      senderName: `${currentRole} User`,
      senderRole: currentRole,
      senderEmail: 'user@dutro.ai',
      timestamp: 'Just now',
      text: 'Attaching audit artifact for verification and control mapping.',
      attachments: [
        {
          name: 'Compliance_Checklist_Q4.pdf',
          size: '340 KB',
          fileType: 'pdf',
          url: '#',
        },
      ],
    };
    setMessages([...messages, newMsg]);
  };

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600">
          <span>Company Landscape</span>
          <span>/</span>
          <span className="text-slate-500">Collaborative Operations</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">Workspace</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time collaborative channels, message threading, custodian coordination, and inline evidence linkage.
        </p>
      </div>

      {/* Main Workspace 3-Pane Layout */}
      <div className="h-[680px] rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs flex">
        {/* Left: Channels Sidebar */}
        <div className="w-64 border-r border-slate-200 bg-slate-50/60 flex flex-col justify-between select-none">
          <div className="p-3 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between px-2 pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Channels</span>
              <button
                onClick={() => setIsCreateChannelOpen(true)}
                title="Create a channel"
                className="rounded p-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* General Channels */}
            <div className="space-y-0.5">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">General</span>
              {channels
                .filter((c) => !c.isDepartmentChannel)
                .map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeChannelId === ch.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {ch.isPrivate ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {ch.unreadCount && ch.unreadCount > 0 ? (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          activeChannelId === ch.id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {ch.unreadCount}
                      </span>
                    ) : null}
                  </button>
                ))}
            </div>

            {/* Auto-provisioned Department Channels */}
            <div className="space-y-0.5">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Departments</span>
              {channels
                .filter((c) => c.isDepartmentChannel)
                .map((ch) => (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannelId(ch.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      activeChannelId === ch.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Hash className="h-3.5 w-3.5 text-slate-400" />
                      <span className="truncate">{ch.name}</span>
                    </div>
                    {ch.unreadCount && ch.unreadCount > 0 ? (
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          activeChannelId === ch.id ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {ch.unreadCount}
                      </span>
                    ) : null}
                  </button>
                ))}
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Enterprise Workspace</span>
            <span className="h-2 w-2 rounded-full bg-emerald-500" title="Connected" />
          </div>
        </div>

        {/* Center: Discussion Pane */}
        <div className="flex-1 flex flex-col justify-between bg-white">
          {/* Channel Header */}
          <div className="h-14 border-b border-slate-200 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-slate-400" />
              <span className="font-bold text-sm text-slate-900">{activeChannel.name}</span>
              <span className="text-xs text-slate-400 font-medium ml-2">{activeChannel.description}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {activeChannel.memberCount} members online
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {channelMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3 text-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs uppercase shadow-2xs">
                  {msg.senderName[0]}
                </div>
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{msg.senderName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                      {msg.senderRole}
                    </span>
                    <span className="text-slate-400 text-[11px]">{msg.timestamp}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{msg.text}</p>

                  {/* Attachments */}
                  {msg.attachments && (
                    <div className="pt-2 space-y-1.5">
                      {msg.attachments.map((att, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            setPreviewAttachment(att);
                            setEvidenceMappedSuccess(false);
                          }}
                          className="inline-flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 hover:bg-blue-50/60 hover:border-blue-300 transition cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <span className="font-semibold text-slate-800 block text-xs">{att.name}</span>
                            <span className="text-[10px] text-slate-400">{att.size} • Click to inspect & map</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-slate-200 bg-slate-50/40">
            <div className="rounded-xl border border-slate-200 bg-white p-2.5 focus-within:border-blue-500 shadow-2xs">
              <input
                type="text"
                placeholder={`Send a note to #${activeChannel.name}. Type @ to mention a teammate...`}
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none pb-2"
              />
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleAttachSimulatedDoc}
                    title="Attach file"
                    className="p-1 rounded hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <button
                    title="Mention someone"
                    className="p-1 rounded hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <AtSign className="h-4 w-4" />
                  </button>
                  <span className="text-[10px] text-slate-400 ml-2">Markdown supported</span>
                </div>
                <button
                  onClick={handleSendMessage}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700 transition cursor-pointer shadow-xs"
                >
                  <Send className="h-3 w-3" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE CHANNEL MODAL */}
      {isCreateChannelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create a channel</h3>
              <button
                onClick={() => setIsCreateChannelOpen(false)}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Channel Name</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">#</span>
                  <input
                    type="text"
                    placeholder="e.g. q4-audit"
                    value={newChannelForm.name}
                    onChange={(e) => setNewChannelForm({ ...newChannelForm, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 pl-7 pr-3 py-1.5 text-xs outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Topic (Optional)</label>
                <input
                  type="text"
                  placeholder="What is this channel about?"
                  value={newChannelForm.purpose}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, purpose: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <span className="font-semibold text-slate-800 block">Make private</span>
                  <span className="text-[11px] text-slate-400">Only invited members can view this channel</span>
                </div>
                <input
                  type="checkbox"
                  checked={newChannelForm.isPrivate}
                  onChange={(e) => setNewChannelForm({ ...newChannelForm, isPrivate: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsCreateChannelOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newChannelForm.name.trim()) return;
                  const created: WorkspaceChannel = {
                    id: `chan-${Date.now()}`,
                    name: newChannelForm.name.toLowerCase().replace(/\s+/g, '-'),
                    isPrivate: newChannelForm.isPrivate,
                    memberCount: 5,
                    description: newChannelForm.purpose || 'Custom project discussion channel.',
                  };
                  setChannels([...channels, created]);
                  setActiveChannelId(created.id);
                  setIsCreateChannelOpen(false);
                  setNewChannelForm({ name: '', purpose: '', isPrivate: false });
                }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW & "MAP AS EVIDENCE" MODAL */}
      {previewAttachment && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">{previewAttachment.name}</h3>
              </div>
              <button
                onClick={() => {
                  setPreviewAttachment(null);
                  setIsMappingEvidence(false);
                }}
                className="rounded p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Document inspection canvas */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center space-y-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xs mx-auto text-blue-600">
                <FileText className="h-8 w-8" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{previewAttachment.name}</p>
              <p className="text-xs text-slate-500">File size: {previewAttachment.size} • Verified SHA-256 Hash</p>
              <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                Tamper-Evident Ledger Integrity Confirmed
              </span>
            </div>

            {/* Map as Evidence Form */}
            {isMappingEvidence ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4 space-y-3 text-xs">
                <span className="font-bold text-blue-900 block">Link Proof to Global Framework Control</span>
                <select
                  value={selectedControlForMap}
                  onChange={(e) => setSelectedControlForMap(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs bg-white outline-none cursor-pointer"
                >
                  {INITIAL_GLOBAL_CONTROLS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.id} — {c.title} ({c.domainName})
                    </option>
                  ))}
                </select>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsMappingEvidence(false)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 bg-white hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setEvidenceMappedSuccess(true);
                      setTimeout(() => {
                        setIsMappingEvidence(false);
                        setPreviewAttachment(null);
                      }, 1500);
                    }}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                  >
                    Confirm Mapping
                  </button>
                </div>
              </div>
            ) : null}

            {evidenceMappedSuccess && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Proof successfully linked to Control {selectedControlForMap} in the Evidence Bank!
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-400">Source: #{activeChannel.name}</span>
              {!isMappingEvidence && !evidenceMappedSuccess && (
                <button
                  onClick={() => setIsMappingEvidence(true)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 cursor-pointer shadow-xs"
                >
                  Map as Evidence
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
