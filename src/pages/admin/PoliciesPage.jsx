import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import { useToast } from '../../store/ToastContext.jsx';
import Skeleton from '../../components/common/Skeleton.jsx';

const PoliciesPage = () => {
  const { toast } = useToast();
  const [policies, setPolicies] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminService
      .getPolicies()
      .then((data) => {
        const map = {};
        (data || []).forEach((p) => { map[p.key] = p.value; });
        setPolicies(map);
      })
      .catch((err) => toast.error(err?.message))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) =>
    setPolicies((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await adminService.updatePolicies(policies);
      toast.success('Policies saved');
    } catch (err) {
      toast.error(err?.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton variant="card" count={2} />;

  const num = (v) => Number(v) || 0;

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">System Policies</h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Platform-wide thresholds and AI configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-space-lg">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
          <h3 className="font-headline-sm font-bold text-on-surface mb-6">
            Attendance & Compliance
          </h3>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-on-surface">Minimum Required Attendance (%)</span>
              <span className="font-label-md font-semibold text-primary">
                {num(policies['attendance.min_percent'])}%
              </span>
            </div>
            <input
              type="range" min="0" max="100"
              value={num(policies['attendance.min_percent'])}
              onChange={(e) => set('attendance.min_percent', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block font-body-md text-on-surface mb-2">
              Max Allowed Consecutive Late Reports
            </label>
            <input
              type="number" min="0"
              value={num(policies['attendance.max_consecutive_late'])}
              onChange={(e) => set('attendance.max_consecutive_late', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="mt-6 px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Policies'}
          </button>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
          <h3 className="font-headline-sm font-bold text-on-surface mb-6">
            AI Engine & Risk Controls
          </h3>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-on-surface">AI Skill Match Automation (%)</span>
              <span className="font-label-md font-semibold text-secondary">
                {num(policies['ai.skill_match_threshold'])}%
              </span>
            </div>
            <input
              type="range" min="0" max="100"
              value={num(policies['ai.skill_match_threshold'])}
              onChange={(e) => set('ai.skill_match_threshold', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-body-md text-on-surface">Auto-Approve Threshold Score</span>
              <span className="font-label-md font-semibold text-secondary">
                {num(policies['ai.auto_approve_threshold'])}%
              </span>
            </div>
            <input
              type="range" min="0" max="100"
              value={num(policies['ai.auto_approve_threshold'])}
              onChange={(e) => set('ai.auto_approve_threshold', parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-label-md font-semibold disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save AI Thresholds'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoliciesPage;