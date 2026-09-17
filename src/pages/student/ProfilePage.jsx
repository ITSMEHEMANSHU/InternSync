import { useState } from 'react';
import { useToast } from '../../store/ToastContext.jsx';
import { STUDENT_PROFILE } from '../../data/mockData.js';
import FileUpload from '../../components/common/FileUpload.jsx';
import Tabs from '../../components/common/Tabs.jsx';

const TABS = [
  { id: 'profile', label: 'Profile', icon: 'person' },
  { id: 'skills', label: 'Skills & Interests', icon: 'psychology' },
  { id: 'academic', label: 'Academic Info', icon: 'school' },
];

const StudentProfilePage = () => {
  const toast = useToast();
  const [tab, setTab] = useState('profile');
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl text-headline-xl font-bold text-on-surface">My Profile</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your profile, skills, and academic information</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:opacity-90 transition-all disabled:opacity-60">
          <span className="material-symbols-outlined text-[18px]">{saving ? 'hourglass_empty' : 'save'}</span>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <Tabs tabs={TABS} activeTab={tab} onChange={setTab} />

      {tab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-[24px]">
                {STUDENT_PROFILE.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <p className="font-headline-md text-headline-md font-bold text-on-surface">{STUDENT_PROFILE.name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{STUDENT_PROFILE.branch} · Sem {STUDENT_PROFILE.semester}</p>
              </div>
            </div>
            {[
              { label: 'Full Name', value: STUDENT_PROFILE.name },
              { label: 'Email', value: STUDENT_PROFILE.email },
              { label: 'Phone', value: STUDENT_PROFILE.phone },
              { label: 'Roll Number', value: STUDENT_PROFILE.rollNo },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md font-semibold text-on-surface">{f.label}</label>
                <input defaultValue={f.value} className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
              </div>
            ))}
          </div>
          <div className="lg:col-span-4 flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-3">Resume</h3>
              <FileUpload accept=".pdf,.doc,.docx" label="Upload Resume (PDF)" onUpload={(f) => setResume(f)} currentFile={resume} />
            </div>
          </div>
        </div>
      )}

      {tab === 'skills' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Technical Skills</h3>
          <div className="flex flex-wrap gap-2 mb-6">
            {STUDENT_PROFILE.skills.map((s) => (
              <span key={s} className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md font-semibold">{s}</span>
            ))}
          </div>
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {STUDENT_PROFILE.interests.map((i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-semibold">{i}</span>
            ))}
          </div>
        </div>
      )}

      {tab === 'academic' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Branch', value: STUDENT_PROFILE.branch },
            { label: 'Semester', value: `Semester ${STUDENT_PROFILE.semester}` },
            { label: 'CGPA', value: STUDENT_PROFILE.cgpa },
            { label: 'Academic Year', value: STUDENT_PROFILE.academicYear },
          ].map((f) => (
            <div key={f.label} className="flex flex-col gap-1.5">
              <label className="font-label-md text-label-md font-semibold text-on-surface">{f.label}</label>
              <input defaultValue={f.value} className="h-10 px-3 rounded-lg border border-outline-variant/60 bg-surface-container-low font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProfilePage;
