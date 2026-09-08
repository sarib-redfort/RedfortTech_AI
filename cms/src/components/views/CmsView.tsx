/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layout, Info, HelpCircle, Edit, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { HomepageCms, AboutCms, Faq, Service } from '../../types';
import Button from '../forms/Button';
import Input from '../forms/Input';
import TextArea from '../forms/TextArea';
import Select from '../forms/Select';
import ImageUpload from '../forms/ImageUpload';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../services/api';
import { normalizeImageUrl } from '../../utils/image';

interface CmsViewProps {
  initialTab?: 'homepage' | 'about' | 'faqs';
  homepage: HomepageCms;
  onUpdateHomepage: (data: HomepageCms) => void;
  about: AboutCms;
  onUpdateAbout: (data: AboutCms) => void;
  faqs: Faq[];
  services: Service[];
  onAddFaq: (data: Omit<Faq, 'id'>) => void;
  onEditFaq: (id: string, data: Partial<Faq>) => void;
  onDeleteFaq: (id: string) => void;
}

export default function CmsView({
  initialTab,
  homepage,
  onUpdateHomepage,
  about,
  onUpdateAbout,
  faqs,
  services,
  onAddFaq,
  onEditFaq,
  onDeleteFaq,
}: CmsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'homepage' | 'about' | 'faqs'>(initialTab || 'homepage');
  const [homepageLoaded, setHomepageLoaded] = useState(false);
  const [aboutLoaded, setAboutLoaded] = useState(false);

  // FAQs State
  const [faqFormOpen, setFaqFormOpen] = useState(false);
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqStatus, setFaqStatus] = useState<'Active' | 'Inactive'>('Active');
  const [faqTargetPage, setFaqTargetPage] = useState('');
  const [faqServiceId, setFaqServiceId] = useState('');
  const [faqTargetPageError, setFaqTargetPageError] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const activeServices = availableServices.length > 0 ? availableServices : services.filter((service) => service.status === 'Active');

  // Homepage CMS State
  const [heroTitle, setHeroTitle] = useState('');
  const [heroDesc, setHeroDesc] = useState('');
  const [heroBtn, setHeroBtn] = useState('');
  const [heroImg, setHeroImg] = useState<string | File>('');

  // Homepage Counters State
  const [happyClients, setHappyClients] = useState('');
  const [industriesServed, setIndustriesServed] = useState('');
  const [yearsExperience, setYearsExperience] = useState('');
  const [clientSatisfaction, setClientSatisfaction] = useState('');

  // About CMS State
  const [aboutTitle, setAboutTitle] = useState('');
  const [aboutDesc, setAboutDesc] = useState('');
  const [aboutImg, setAboutImg] = useState<string | File>('');

  // Synchronize local states when props change after data has been loaded
  React.useEffect(() => {
    if (!homepageLoaded) return;
    setHeroTitle(homepage.heroTitle ?? '');
    setHeroDesc(homepage.heroDescription ?? '');
    setHeroBtn(homepage.buttonText ?? '');
    setHeroImg(homepage.heroImage ?? '');
    setHappyClients(homepage.happyClients ?? '');
    setIndustriesServed(homepage.industriesServed ?? '');
    setYearsExperience(homepage.yearsExperience ?? '');
    setClientSatisfaction(homepage.clientSatisfaction ?? '');
  }, [homepage, homepageLoaded]);

  React.useEffect(() => {
    if (!aboutLoaded) return;
    setAboutTitle(about.title ?? '');
    setAboutDesc(about.description ?? '');
    setAboutImg(about.image ?? '');
  }, [about, aboutLoaded]);

  React.useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  React.useEffect(() => {
    if (activeSubTab !== 'homepage') return;

    let isMounted = true;

    const loadHomepageData = async () => {
      setHomepageLoaded(false);
      try {
        const response = await apiClient.get('/admin/homepage');
        console.log('[CMS Homepage GET response]', response.data);
        const payload = response.data?.data ?? response.data ?? null;

        if (!payload || !isMounted) return;

        const normalizedHomepage: HomepageCms = {
          heroTitle: payload.heroTitle ?? '',
          heroDescription: payload.heroDescription ?? '',
          heroImage: payload.heroImage || payload.image || '',
          buttonText: payload.buttonText ?? '',
          happyClients: payload.happyClients ?? '',
          industriesServed: payload.industriesServed ?? '',
          yearsExperience: payload.yearsExperience ?? '',
          clientSatisfaction: payload.clientSatisfaction ?? '',
        };

        setHeroTitle(normalizedHomepage.heroTitle);
        setHeroDesc(normalizedHomepage.heroDescription);
        setHeroBtn(normalizedHomepage.buttonText);
        setHeroImg(normalizedHomepage.heroImage);
        setHappyClients(normalizedHomepage.happyClients ?? '');
        setIndustriesServed(normalizedHomepage.industriesServed ?? '');
        setYearsExperience(normalizedHomepage.yearsExperience ?? '');
        setClientSatisfaction(normalizedHomepage.clientSatisfaction ?? '');
        onUpdateHomepage(normalizedHomepage);
        setHomepageLoaded(true);
      } catch (error: any) {
        if (!isMounted) return;
        if (error?.response?.status === 404) {
          setHeroTitle('');
          setHeroDesc('');
          setHeroBtn('');
          setHeroImg('');
          setHappyClients('');
          setIndustriesServed('');
          setYearsExperience('');
          setClientSatisfaction('');
          setHomepageLoaded(true);
          return;
        }

        console.error('[CMS] Failed to load homepage data:', error);
        setHomepageLoaded(true);
      }
    };

    void loadHomepageData();

    return () => {
      isMounted = false;
    };
  }, [activeSubTab, onUpdateHomepage]);

  React.useEffect(() => {
    if (activeSubTab !== 'about') return;

    let isMounted = true;

    const loadAboutData = async () => {
      setAboutLoaded(false);
      try {
        const response = await apiClient.get('/admin/about');
        console.log('[CMS About GET response]', response.data);
        const payload = response.data?.data ?? response.data ?? null;

        if (!payload || !isMounted) return;

        const normalizedAbout: AboutCms = {
          title: payload.title ?? '',
          description: payload.description ?? '',
          image: payload.aboutImage || payload.image || payload.heroImage || '',
        };

        setAboutTitle(normalizedAbout.title);
        setAboutDesc(normalizedAbout.description);
        setAboutImg(normalizedAbout.image);
        onUpdateAbout(normalizedAbout);
        setAboutLoaded(true);
      } catch (error: any) {
        if (!isMounted) return;
        if (error?.response?.status === 404) {
          setAboutTitle('');
          setAboutDesc('');
          setAboutImg('');
          setAboutLoaded(true);
          return;
        }

        console.error('[CMS] Failed to load about data:', error);
        setAboutLoaded(true);
      }
    };

    void loadAboutData();

    return () => {
      isMounted = false;
    };
  }, [activeSubTab, onUpdateAbout]);

  React.useEffect(() => {
    const loadServiceOptions = async () => {
      if (faqTargetPage !== 'Services') {
        setAvailableServices([]);
        return;
      }

      try {
        const response = await apiClient.get('/services');
        const payload = response.data?.services || response.data?.data || response.data;
        const normalizedServices = (Array.isArray(payload) ? payload : []).map((service: any) => ({
          ...service,
          id: service.id || service._id,
          title: service.title || service.name || '',
          description: service.description || '',
          icon: service.icon || '',
          status: service.status || 'Active',
        })) as Service[];

        setAvailableServices(normalizedServices.filter((service) => service.status === 'Active'));
      } catch (error) {
        console.error('[CMS FAQ] Failed to load services for target page:', error);
        setAvailableServices(services.filter((service) => service.status === 'Active'));
      }
    };

    void loadServiceOptions();
  }, [faqTargetPage, services]);

  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: HomepageCms = {
      heroTitle,
      heroDescription: heroDesc,
      buttonText: heroBtn,
      heroImage: typeof heroImg === 'string' ? heroImg : homepage.heroImage,
      happyClients: String(Number(happyClients) || 0),
      industriesServed: String(Number(industriesServed) || 0),
      yearsExperience: String(Number(yearsExperience) || 0),
      clientSatisfaction: String(Number(clientSatisfaction) || 0),
    };

    const formData = new FormData();
    formData.append('heroTitle', heroTitle);
    formData.append('heroDescription', heroDesc);
    formData.append('buttonText', heroBtn);
    if (heroImg instanceof File) {
      formData.append('heroImage', heroImg);
    } else if (heroImg) {
      formData.append('heroImage', heroImg);
    }
    formData.append('happyClients', String(Number(happyClients) || 0));
    formData.append('industriesServed', String(Number(industriesServed) || 0));
    formData.append('yearsExperience', String(Number(yearsExperience) || 0));
    formData.append('clientSatisfaction', String(Number(clientSatisfaction) || 0));

    try {
      let existingResponse: any;
      try {
        existingResponse = await apiClient.get('/admin/homepage');
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }

      const response = existingResponse
        ? await apiClient.patch('/admin/homepage', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/admin/homepage', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      const savedData = (response.data?.data ?? response.data ?? payload) as HomepageCms;
      onUpdateHomepage(savedData);
      setHeroImg(savedData.heroImage || payload.heroImage);
      toast.success('Homepage configurations saved!');
    } catch (error: any) {
      console.error('[CMS] Failed to save homepage:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save homepage');
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: AboutCms = {
      title: aboutTitle,
      description: aboutDesc,
      image: typeof aboutImg === 'string' ? aboutImg : about.image,
    };

    const formData = new FormData();
    formData.append('title', aboutTitle);
    formData.append('description', aboutDesc);
    if (aboutImg instanceof File) {
      formData.append('image', aboutImg);
    } else if (aboutImg) {
      formData.append('image', aboutImg);
    }

    try {
      let existingResponse: any;
      try {
        existingResponse = await apiClient.get('/admin/about');
      } catch (error: any) {
        if (error?.response?.status !== 404) {
          throw error;
        }
      }

      const response = existingResponse
        ? await apiClient.patch('/admin/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        : await apiClient.post('/admin/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      const savedData = (response.data?.data ?? response.data ?? payload) as AboutCms;
      onUpdateAbout(savedData);
      setAboutImg(savedData.image || payload.image);
      toast.success('About configurations saved!');
    } catch (error: any) {
      console.error('[CMS] Failed to save about:', error);
      toast.error(error?.response?.data?.message || error?.message || 'Failed to save about');
    }
  };

  // FAQs Handlers
  const handleOpenAddFaq = () => {
    setFaqQuestion('');
    setFaqAnswer('');
    setFaqStatus('Active');
    setFaqTargetPage('');
    setFaqServiceId('');
    setFaqTargetPageError('');
    setEditingFaqId(null);
    setFaqFormOpen(true);
  };

  const handleOpenEditFaq = (f: Faq) => {
    setFaqQuestion(f.question);
    setFaqAnswer(f.answer);
    setFaqStatus(f.status);
    setFaqTargetPage(f.page || '');
    setFaqServiceId(f.serviceId || '');
    setFaqTargetPageError('');
    setEditingFaqId(f.id);
    setFaqFormOpen(true);
  };

  const handleSaveFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqQuestion.trim() || !faqAnswer.trim()) {
      toast.error('Question and answer are required.');
      return;
    }

    if (!faqTargetPage) {
      setFaqTargetPageError('Please select a target page or section.');
      return;
    }

    if (faqTargetPage === 'Services' && !faqServiceId) {
      setFaqTargetPageError('Please choose a service for the Services target.');
      return;
    }

    setFaqTargetPageError('');

    const faqPayload = {
      question: faqQuestion.trim(),
      answer: faqAnswer.trim(),
      status: faqStatus,
      page: faqTargetPage,
      ...(faqTargetPage === 'Services' && faqServiceId ? { serviceId: faqServiceId } : {}),
    };

    if (editingFaqId) {
      onEditFaq(editingFaqId, faqPayload);
      toast.success('FAQ updated successfully!');
    } else {
      onAddFaq(faqPayload);
      toast.success('FAQ added successfully!');
    }
    setFaqFormOpen(false);
  };

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm shadow-gray-100/50 animate-fade-in select-none overflow-hidden">
      <div className="p-6">
        {activeSubTab === 'homepage' && (
          /* HOMEPAGE HERO EDITOR */
          <div className="grid grid-cols-1 gap-8">
            <form onSubmit={handleSaveHomepage} className="space-y-6">
              <div>
                <h4 className="font-bold text-text-dark text-base mb-1">Hero Section Settings</h4>
                <p className="text-xs text-text-gray font-semibold">Customize main landing details shown to users</p>
              </div>

              <Input
                label="Hero Title Heading"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
              />

              <TextArea
                label="Hero Paragraph Description"
                rows={4}
                value={heroDesc}
                onChange={(e) => setHeroDesc(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Button Trigger Text"
                  value={heroBtn}
                  onChange={(e) => setHeroBtn(e.target.value)}
                />

                <ImageUpload
                  label="Image Illustration"
                  value={heroImg}
                  onChange={(value) => setHeroImg(value)}
                />
              </div>

              {/* Counter Statistics Section */}
              <div className="border-t border-gray-100 pt-4">
                <h5 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-3">Counter Statistics</h5>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Happy Clients Count"
                    placeholder="e.g. 500+"
                    value={happyClients}
                    onChange={(e) => setHappyClients(e.target.value)}
                  />
                  <Input
                    label="Industries Served"
                    placeholder="e.g. 12+"
                    value={industriesServed}
                    onChange={(e) => setIndustriesServed(e.target.value)}
                  />
                  <Input
                    label="Years of Experience"
                    placeholder="e.g. 8+"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(e.target.value)}
                  />
                  <Input
                    label="Client Satisfaction"
                    placeholder="e.g. 99%"
                    value={clientSatisfaction}
                    onChange={(e) => setClientSatisfaction(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold"
                >
                  Save homepage CMS
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === 'about' && (
          /* ABOUT SECTION EDITOR */
          <div className="grid grid-cols-1 gap-8">
            <form onSubmit={handleSaveAbout} className="space-y-6">
              <div>
                <h4 className="font-bold text-text-dark text-base mb-1">About Page CMS Settings</h4>
                <p className="text-xs text-text-gray font-semibold">Define your mission, vision and team details</p>
              </div>

              <Input
                label="About Header Title"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
              />

              <TextArea
                label="About Narrative Description"
                rows={5}
                value={aboutDesc}
                onChange={(e) => setAboutDesc(e.target.value)}
              />

              <ImageUpload
                label="Corporate Image Banner"
                value={aboutImg}
                onChange={(value) => setAboutImg(value)}
              />

              <div className="pt-4 border-t border-gray-100">
                <Button
                  type="submit"
                  className="bg-[#DC2626] hover:bg-red-700 text-white font-semibold"
                >
                  Save about CMS
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeSubTab === 'faqs' && (
          /* FAQS ACCORDION CRUD VIEWS */
          <div className="space-y-6">
            {!faqFormOpen ? (
              /* ACCORDION FAQS LIST */
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <h4 className="font-bold text-text-dark text-base">Frequently Asked Questions</h4>
                    <p className="text-xs text-text-gray font-medium mt-0.5">Toggle rows to review answer details</p>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={handleOpenAddFaq}
                    className="bg-primary-red hover:bg-primary-red-hover text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 px-3 py-1.5"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </Button>
                </div>

                <div className="divide-y divide-gray-100 border border-gray-100 rounded-xl overflow-hidden">
                  {faqs.map((f) => {
                    const isExpanded = expandedFaqId === f.id;
                    return (
                      <div key={f.id} className="bg-white hover:bg-gray-50/50 transition-colors">
                        <div 
                          className="p-4 flex items-center justify-between cursor-pointer select-none"
                          onClick={() => setExpandedFaqId(isExpanded ? null : f.id)}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 rounded-full ${f.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                            <h5 className="text-sm font-bold text-text-dark">{f.question}</h5>
                          </div>

                          <div className="flex items-center gap-4">
                            {/* Accordion toggle trigger */}
                            {isExpanded ? <ChevronUp className="w-4 h-4 text-text-gray" /> : <ChevronDown className="w-4 h-4 text-text-gray" />}
                            
                            {/* Actions */}
                            <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => handleOpenEditFaq(f)}
                                className="p-1 rounded hover:bg-gray-100 text-text-gray hover:text-primary-red transition-all"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteFaq(f.id)}
                                className="p-1 rounded hover:bg-gray-100 text-text-gray hover:text-red-600 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Answer text container panel */}
                        {isExpanded && (
                          <div className="px-9 pb-4.5 text-xs text-text-gray leading-relaxed font-semibold">
                            {f.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* FAQS ADD / EDIT FORM OVERLAYS */
              <form onSubmit={handleSaveFaq} className="space-y-6 max-w-xl animate-fade-in">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <h4 className="font-bold text-text-dark text-base">
                    {editingFaqId ? 'Edit Accordion Question' : 'Add Accordion Question'}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setFaqFormOpen(false)}
                    className="text-text-gray hover:text-text-dark transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <Input
                  label="Question Inquiry Text"
                  placeholder="e.g. What are your customer support timings?"
                  value={faqQuestion}
                  onChange={(e) => setFaqQuestion(e.target.value)}
                />

                <TextArea
                  label="Inquiry Response Answer"
                  placeholder="Provide precise answer statement details here..."
                  rows={4}
                  value={faqAnswer}
                  onChange={(e) => setFaqAnswer(e.target.value)}
                />

                <Select
                  label="Target Page / Section"
                  options={[
                    { value: '', label: 'Select a target page' },
                    { value: 'Homepage', label: 'Homepage' },
                    { value: 'About Page', label: 'About Page' },
                    { value: 'Contact Page', label: 'Contact Page' },
                    { value: 'Case Studies', label: 'Case Studies' },
                    { value: 'Services', label: 'Services' },
                  ]}
                  value={faqTargetPage}
                  error={faqTargetPageError}
                  onChange={(e) => {
                    const nextValue = e.target.value;
                    setFaqTargetPage(nextValue);
                    setFaqTargetPageError('');
                    if (nextValue !== 'Services') {
                      setFaqServiceId('');
                    }
                  }}
                />

                {faqTargetPage === 'Services' && (
                  <Select
                    label="Service"
                    options={[
                      { value: '', label: 'Select a service' },
                      ...activeServices.map((service) => ({ value: service.id, label: service.title })),
                    ]}
                    value={faqServiceId}
                    onChange={(e) => setFaqServiceId(e.target.value)}
                  />
                )}

                <Select
                  label="Publication Status"
                  options={[
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                  ]}
                  value={faqStatus}
                  onChange={(e) => setFaqStatus(e.target.value as any)}
                />

                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setFaqFormOpen(false)}
                    className="w-28"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="w-28 bg-[#DC2626] hover:bg-red-700 text-white"
                  >
                    Save FAQ
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
