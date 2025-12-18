import React from 'react';

interface LoadingSkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    width?: string | number;
    height?: string | number;
    className?: string;
    count?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    variant = 'text',
    width = '100%',
    height,
    className = '',
    count = 1,
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'circular':
                return 'rounded-full';
            case 'rectangular':
                return 'rounded-lg';
            case 'card':
                return 'rounded-xl';
            case 'text':
            default:
                return 'rounded';
        }
    };

    const getDefaultHeight = () => {
        switch (variant) {
            case 'circular':
                return width;
            case 'card':
                return '200px';
            case 'text':
                return '1em';
            default:
                return height || '20px';
        }
    };

    const skeletonStyle = {
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height || getDefaultHeight(),
    };

    const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
    dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
    animate-pulse
    ${getVariantClasses()}
    ${className}
  `;

    if (count > 1) {
        return (
            <div className="space-y-2">
                {Array.from({ length: count }).map((_, index) => (
                    <div key={index} className={baseClasses} style={skeletonStyle} />
                ))}
            </div>
        );
    }

    return <div className={baseClasses} style={skeletonStyle} />;
};

// Preset skeleton components for common use cases
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`card-modern p-6 ${className}`}>
        <div className="flex items-center space-x-4 mb-4">
            <LoadingSkeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
                <LoadingSkeleton width="60%" height={20} />
                <LoadingSkeleton width="40%" height={16} />
            </div>
        </div>
        <LoadingSkeleton count={3} height={16} className="mb-2" />
    </div>
);

export const SkeletonTable: React.FC<{ rows?: number; className?: string }> = ({
    rows = 5,
    className = ''
}) => (
    <div className={`card-modern overflow-hidden ${className}`}>
        <div className="p-4 bg-gray-50 dark:bg-gray-800">
            <LoadingSkeleton width="30%" height={20} />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="p-4 flex items-center space-x-4">
                    <LoadingSkeleton variant="circular" width={40} height={40} />
                    <div className="flex-1 space-y-2">
                        <LoadingSkeleton width="70%" height={16} />
                        <LoadingSkeleton width="50%" height={14} />
                    </div>
                    <LoadingSkeleton width={80} height={32} className="rounded-full" />
                </div>
            ))}
        </div>
    </div>
);

export const SkeletonDashboard: React.FC = () => (
    <div className="space-y-6">
        {/* Header skeleton */}
        <div className="card-modern p-6 glass">
            <div className="flex items-center space-x-4">
                <LoadingSkeleton variant="circular" width={80} height={80} />
                <div className="flex-1 space-y-3">
                    <LoadingSkeleton width="40%" height={32} />
                    <LoadingSkeleton width="60%" height={20} />
                </div>
            </div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="card-modern p-6">
                    <div className="flex items-center">
                        <LoadingSkeleton variant="circular" width={48} height={48} />
                        <div className="ml-4 flex-1 space-y-2">
                            <LoadingSkeleton width="60%" height={14} />
                            <LoadingSkeleton width="40%" height={24} />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Content cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    </div>
);

export default LoadingSkeleton;
