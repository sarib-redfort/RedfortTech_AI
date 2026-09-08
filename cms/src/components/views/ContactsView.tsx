/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Mail, MailOpen, CornerUpLeft, Trash2, Send, CheckCircle2 } from 'lucide-react';
import { Contact } from '../../types';
import Button from '../forms/Button';
import TextArea from '../forms/TextArea';
import Modal from '../common/Modal';
import { toast } from 'react-hot-toast';

interface ContactsViewProps {
  contacts: Contact[];
  onUpdateStatus: (id: string, status: Contact['status']) => void;
  onDeleteContact: (id: string) => void;
}

export default function ContactsView({
  contacts,
  onUpdateStatus,
  onDeleteContact,
}: ContactsViewProps) {
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.subject.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (contact.status === 'New') {
      onUpdateStatus(contact.id, 'Read');
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onDeleteContact(id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Reply body content is empty!');
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      if (selectedContact) {
        onUpdateStatus(selectedContact.id, 'Replied');
      }
      setIsSending(false);
      setReplyText('');
      setSelectedContact(null);
      toast.success('Reply email dispatched successfully!');
    }, 1000);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm shadow-gray-100/50 animate-fade-in select-none">
      
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-bold text-text-dark text-base">Contact Inbox Messages</h3>
            <p className="text-xs text-text-gray font-medium mt-0.5">Customer feedback and partnership inquiries</p>
          </div>
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-border-gray rounded-lg text-sm text-text-dark bg-gray-50/50 outline-none focus:bg-white focus:border-primary-red focus:ring-2 focus:ring-red-50 transition-all"
            />
          </div>
        </div>

        {/* Message Inbox list */}
        <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
          {filtered.length > 0 ? (
            filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => handleOpenContact(c)}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-gray-50/50 transition-all ${
                  c.status === 'New' ? 'bg-red-50/10 border-l-4 border-primary-red' : ''
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    c.status === 'New' ? 'bg-red-50 text-primary-red' : 'bg-gray-50 text-text-gray'
                  }`}>
                    {c.status === 'New' ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${c.status === 'New' ? 'font-bold text-text-dark' : 'font-semibold text-text-gray'}`}>
                        {c.name}
                      </span>
                      <span className="text-[10px] text-text-gray font-medium">({c.email})</span>
                    </div>
                    <p className={`text-xs mt-1 truncate ${c.status === 'New' ? 'font-bold text-text-dark' : 'text-text-gray font-medium'}`}>
                      {c.subject}
                    </p>
                    <p className="text-xs text-text-gray mt-1 line-clamp-1">
                      {c.message}
                    </p>
                    {c.phoneNumber ? (
                      <p className="text-[11px] text-text-gray mt-1.5">
                        {c.phoneNumber}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] text-text-gray font-semibold">{c.date}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${
                    c.status === 'New' ? 'bg-red-50 text-primary-red border border-red-100' :
                    c.status === 'Replied' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}>
                    {c.status}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClick(e, c.id)}
                    className="p-1.5 rounded-lg border border-border-gray hover:border-red-600 hover:text-red-600 transition-all"
                    aria-label={`Delete ${c.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-text-gray font-semibold">
              No conversations found.
            </div>
          )}
        </div>
      </div>

      {/* Message Reader Modal */}
      <Modal
        isOpen={selectedContact !== null}
        onClose={() => setSelectedContact(null)}
        title="Message Conversation Reader"
        maxWidth="max-w-2xl"
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h4 className="font-bold text-text-dark text-base">{selectedContact.subject}</h4>
                <p className="text-xs text-text-gray font-medium mt-1">
                  From: <span className="text-text-dark font-bold">{selectedContact.name}</span> ({selectedContact.email})
                </p>
                {selectedContact.phoneNumber ? (
                  <p className="text-xs text-text-gray font-medium mt-1">
                    Phone: <span className="text-text-dark font-bold">{selectedContact.phoneNumber}</span>
                  </p>
                ) : null}
              </div>
              <span className="text-xs text-text-gray font-semibold">{selectedContact.date}</span>
            </div>

            {/* Original message block */}
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
              <span className="text-[10px] font-bold text-text-gray block uppercase tracking-wider mb-2">Original Message</span>
              <p className="text-xs text-text-dark leading-relaxed font-medium">
                {selectedContact.message}
              </p>
            </div>

            {/* Simulated Send reply form */}
            {selectedContact.status !== 'Replied' ? (
              <form onSubmit={handleSendReply} className="space-y-4 pt-4 border-t border-gray-100">
                <TextArea
                  label="Quick Reply Draft"
                  placeholder="Type your official response email here..."
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  disabled={isSending}
                />
                
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedContact(null)}
                    disabled={isSending}
                    className="w-24"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSending}
                    className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold flex items-center gap-1.5 px-4"
                  >
                    <Send className="w-4 h-4" /> Dispatch Reply
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 bg-emerald-50/50 border border-emerald-100 rounded-xl text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                <h5 className="text-sm font-bold text-text-dark">Message Replied!</h5>
                <p className="text-xs text-text-gray font-medium mt-1">
                  A corporate response email was already dispatched to {selectedContact.email}.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

    </div>
  );
}
