import React from 'react';
import './BoxLayoutSkeleton.css';

const BoxLayoutSkeleton = () => {
  return (
    <>
      {/* Header Skeleton */}
      <div className="box-header-skeleton">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center">
              <div className="skeleton-image"></div>
            </div>
            <div className="col-md-6">
              <div className="skeleton-title mb-3"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-description"></div>
              <div className="skeleton-description mb-4" style={{width: '70%'}}></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="col-md-8 col-lg-6 mx-auto mt-3">
        {[...Array(3)].map((_, subcategoryIndex) => (
          <div key={subcategoryIndex} className="mb-4">
            <div className="skeleton-subtitle mb-3"></div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="skeleton-th"></th>
                    <th className="skeleton-th"></th>
                    <th className="skeleton-th"></th>
                    <th className="skeleton-th"></th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(4)].map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      <td><div className="skeleton-img-small"></div></td>
                      <td><div className="skeleton-text"></div></td>
                      <td><div className="skeleton-price"></div></td>
                      <td>
                        <div className="d-flex justify-content-end">
                          <div className="skeleton-control"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default BoxLayoutSkeleton;