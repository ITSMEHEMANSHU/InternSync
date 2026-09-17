import { useState } from 'react';
import { useAuth } from '../../store/AuthContext.jsx';
import { useToast } from '../../store/ToastContext.jsx';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import Tabs from '../../components/common/Tabs.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';

const TABS = {
  PROFILE: 'profile',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications',
  PREFERENCES: 'preferences',
};

const ProfilePage = () => {
  const { user, role } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(TABS.PROFILE);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Profile updated successfully');
    }, 500);
  };

  const profileTabs = [
    { id: TABS.PROFILE, label: 'Profile' },
    { id: TABS.SECURITY, label: 'Security' },
    { id: TABS.NOTIFICATIONS, label: 'Notifications' },
    { id: TABS.PREFERENCES, label: 'Preferences' },
  ];

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title="Profile Settings"
        breadcrumb="Settings / Profile"
        badge={{ text: role, cls: 'bg-primary-container text-on-primary' }}
        actions={[
          { label: 'Save Changes', onClick: handleSave, loading: isSaving, primary: true },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Left main column */}
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <Tabs tabs={profileTabs} activeTab={activeTab} onChange={setActiveTab} />

          {activeTab === TABS.PROFILE && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <div className="flex items-start gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-headline-lg text-headline-lg font-bold text-primary">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-1">{user?.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-2">{user?.email}</p>
                  <StatusBadge status="Active" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Department</label>
                  <input
                    type="text"
                    placeholder="Computer Science & Engineering"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Bio</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === TABS.SECURITY && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Change Password</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Current Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-outline-variant/30">
                <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                  <div>
                    <p className="font-body-md text-body-md font-semibold text-on-surface">Enable 2FA</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Add an extra layer of security</p>
                  </div>
                  <button className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md font-semibold rounded-lg hover:bg-primary/90">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === TABS.NOTIFICATIONS && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">Notification Preferences</h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Email notifications', desc: 'Receive email updates for important events' },
                  { label: 'Push notifications', desc: 'Get instant push notifications on your device' },
                  { label: 'Weekly reports reminder', desc: 'Get reminded before weekly report deadlines' },
                  { label: 'Application updates', desc: 'Notifications about your application status' },
                  { label: 'Mentor messages', desc: 'Messages from your assigned mentor' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-surface-container rounded-lg">
                    <div>
                      <p className="font-body-md text-body-md font-semibold text-on-surface">{item.label}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={idx < 3} className="sr-only peer" />
                      <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === TABS.PREFERENCES && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">App Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Language</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Timezone</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label-md text-label-md font-semibold text-on-surface mb-2">Date Format</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-space-lg">
          <StatCard
            icon="verified"
            label="Account Status"
            value="Active"
            iconBg="bg-tertiary-fixed/60 text-tertiary"
          />
          <StatCard
            icon="schedule"
            label="Member Since"
            value="Aug 2024"
            iconBg="bg-secondary-fixed/50 text-secondary"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;