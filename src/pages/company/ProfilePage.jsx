import { useState, useEffect } from 'react';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import FileUpload from '../../components/common/FileUpload.jsx';
import { useCompanyProfile } from '../../hooks/useCompanyProfile.js';
import { useToast } from '../../store/ToastContext.jsx';
import { COMPANY_PROFILE } from '../../data/mockData.js';

const CompanyProfilePage = () => {
  const { toast } = useToast();
  const { profile: apiProfile, loading, saving, updateProfile } = useCompanyProfile();
  const [profile, setProfile] = useState(COMPANY_PROFILE);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (apiProfile) {
      setProfile({
        name: apiProfile.name || '',
        industry: apiProfile.industry || '',
        location: apiProfile.location || '',
        website: apiProfile.website || '',
        employees: '50-200',
        contactName: apiProfile.hr_spoc_name || apiProfile.name || '',
        contactEmail: apiProfile.hr_spoc_email || apiProfile.contact_email || '',
        contactPhone: apiProfile.hr_spoc_phone || apiProfile.contact_phone || '',
        description: apiProfile.description || '',
        verified: Boolean(apiProfile.verified),
        logo_url: apiProfile.logo_url || null,
      });
    }
  }, [apiProfile]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profile.name,
        industry: profile.industry,
        location: profile.location,
        website: profile.website,
        hr_spoc_name: profile.contactName,
        hr_spoc_email: profile.contactEmail,
        hr_spoc_phone: profile.contactPhone,
        description: profile.description,
        logo_url: profile.logo_url,
      });
      setIsEditing(false);
      toast.success('Company profile updated successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to update company profile');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col w-full space-y-6">
        <PageHeader title="Company Profile" breadcrumb="Company / Profile" />
        <div className="p-12 text-center text-on-surface-variant font-body-md bg-surface-container-lowest rounded-xl">
          Loading company profile...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full space-y-6">
      <PageHeader
        title="Company Profile"
        breadcrumb="Company / Profile"
        badge={
          profile.verified ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="material-symbols-outlined text-sm">verified</span> Verified Partner
            </span>
          ) : (
            <StatusBadge status="pending" />
          )
        }
        actions={[
          {
            label: isEditing ? 'Cancel' : 'Edit Profile',
            onClick: () => setIsEditing(!isEditing),
            variant: 'outline',
          },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Organization Summary Card */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-2xl bg-primary-fixed/20 flex items-center justify-center text-primary font-bold text-3xl shadow-inner overflow-hidden">
            {profile.logo_url ? (
              <img src={profile.logo_url} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              (profile.name || 'C').charAt(0)
            )}
          </div>
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">{profile.name || 'Company Name'}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">{profile.industry || 'Industry'}</p>
          </div>
          <div className="w-full border-t border-surface-container-high pt-4 space-y-2 text-left">
            <div className="flex justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Location:</span>
              <span className="font-semibold text-on-surface">{profile.location || 'N/A'}</span>
            </div>
            <div className="flex justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Employees:</span>
              <span className="font-semibold text-on-surface">{profile.employees}</span>
            </div>
            <div className="flex justify-between font-body-sm text-body-sm">
              <span className="text-on-surface-variant">Website:</span>
              {profile.website ? (
                <a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noreferrer" className="font-semibold text-primary hover:underline">
                  {profile.website}
                </a>
              ) : (
                <span className="text-on-surface-variant">—</span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form / Details */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl shadow-sm p-6">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6">
            Organization Details
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Company Name</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Industry</label>
                <input
                  type="text"
                  name="industry"
                  value={profile.industry}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">HR SPOC Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={profile.contactName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">HR SPOC Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={profile.contactEmail}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Location / Head Office</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Website URL</label>
                <input
                  type="text"
                  name="website"
                  value={profile.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-1">Description & Overview</label>
              <textarea
                name="description"
                rows={4}
                value={profile.description}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 py-2 bg-surface-container rounded-lg border border-transparent focus:border-primary disabled:opacity-75 font-body-md text-body-md"
              />
            </div>

            {isEditing && (
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-1">Company Logo / Banner</label>
                <FileUpload onUpload={() => toast.info('Logo updated.')} accept="image/*,.pdf" />
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-on-primary font-label-md text-label-md font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
