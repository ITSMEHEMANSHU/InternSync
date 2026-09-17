import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { facultyService } from '../../services/api.js';
import { useToast } from '../../store/ToastContext.jsx';
import { ROUTES } from '../../constants/routes.js';
import PageHeader from '../../components/weekly-reports/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import Modal from '../../components/common/Modal.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';

const ApprovalDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    let mounted = true;
    facultyService
      .getApprovalDetail(id)
      .then((data) => mounted && setApp(data))
      .catch((err) => toast.error(err?.message || 'Failed to load'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id, toast]);

  const handleApprove = async () => {
    setActing(true);
    try {
      await facultyService.approve(id);
      toast.success('Application approved — sent to company');
      navigate(ROUTES.FACULTY.APPROVALS);
    } catch (err) {
      toast.error(err?.message || 'Failed to approve');
    } finally {
      setActing(false);
    }
  };

  const handleReject = async () => {
    setActing(true);
    try {
      await facultyService.reject(id, reason);
      toast.success('Application rejected');
      navigate(ROUTES.FACULTY.APPROVALS);
    } catch (err) {
      toast.error(err?.message || 'Failed to reject');
    } finally {
      setActing(false);
      setRejectOpen(false);
    }
  };

  if (loading) return <Skeleton variant="card" count={2} />;
  if (!app) return <div className="p-8">Not found</div>;

  return (
    <div className="flex flex-col w-full">
      <PageHeader
        title={app.internship?.title || 'Application'}
        breadcrumb={`Approvals / ${app.student?.name} / ${app.internship?.title}`}
        badge={<StatusBadge status={app.status} />}
        actions={[
          { label: 'Back', onClick: () => navigate(-1) },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        <div className="lg:col-span-8 flex flex-col gap-space-lg">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm font-bold text-on-surface mb-4">Student</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Name</p>
                <p className="font-body-md font-semibold text-on-surface">{app.student?.name}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Email</p>
                <p className="font-body-md font-semibold text-on-surface">{app.student?.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm font-bold text-on-surface mb-4">Internship</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Role</p>
                <p className="font-body-md font-semibold text-on-surface">{app.internship?.title}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Company</p>
                <p className="font-body-md font-semibold text-on-surface">{app.company?.name}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Location</p>
                <p className="font-body-md font-semibold text-on-surface">{app.internship?.location}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Stipend</p>
                <p className="font-body-md font-semibold text-on-surface">
                  {app.internship?.stipend ? `₹${app.internship.stipend.toLocaleString('en-IN')}/mo` : '—'}
                </p>
              </div>
            </div>
          </div>

          {app.cover_letter && (
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
              <h3 className="font-headline-sm font-bold text-on-surface mb-4">Cover Letter</h3>
              <p className="font-body-md text-on-surface whitespace-pre-wrap">{app.cover_letter}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <h3 className="font-headline-sm font-bold text-on-surface mb-4">Decision</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleApprove}
                disabled={acting || app.status !== 'pending'}
                className="w-full py-3 rounded-lg bg-primary text-on-primary font-label-md font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {acting ? 'Working…' : 'Approve'}
              </button>
              <button
                onClick={() => setRejectOpen(true)}
                disabled={acting || app.status !== 'pending'}
                className="w-full py-3 rounded-lg bg-error text-on-error font-label-md font-semibold hover:opacity-90 disabled:opacity-60"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject Application"
        footer={
          <>
            <button
              onClick={() => setRejectOpen(false)}
              className="px-4 py-2 bg-surface-container text-on-surface font-label-md font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleReject}
              disabled={acting}
              className="px-4 py-2 bg-error text-on-error font-label-md font-semibold rounded-lg disabled:opacity-60"
            >
              {acting ? 'Rejecting…' : 'Confirm Reject'}
            </button>
          </>
        }
      >
        <label className="block font-label-md font-semibold text-on-surface mb-2">
          Reason (optional)
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Why is this application being rejected?"
          className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </Modal>
    </div>
  );
};

export default ApprovalDetailPage;