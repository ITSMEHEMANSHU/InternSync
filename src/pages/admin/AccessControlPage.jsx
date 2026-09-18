import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService.js';
import Skeleton from '../../components/common/Skeleton.jsx';

const AccessControlPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getAccessControl()
      .then((d) => setData(Array.isArray(d) ? d : []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Skeleton variant="card" count={4} />;

  return (
    <div className="flex flex-col w-full gap-space-lg">
      <div>
        <h1 className="font-headline-xl font-bold text-on-surface">Access Control</h1>
        <p className="font-body-md text-on-surface-variant mt-1">
          Role-based permissions enforced on every API call
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {data.map((r) => (
          <div key={r.role} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold uppercase">
                {r.role}
              </span>
              <h3 className="font-headline-sm font-bold text-on-surface">
                {r.role_name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {r.permissions.length === 0 ? (
                <span className="text-sm text-on-surface-variant">No permissions assigned</span>
              ) : (
                r.permissions.map((p) => (
                  <span
                    key={p}
                    className="px-2 py-1 rounded bg-surface-container text-xs font-mono text-on-surface"
                  >
                    {p}
                  </span>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccessControlPage;