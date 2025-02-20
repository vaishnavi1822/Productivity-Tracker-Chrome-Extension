import React, { useState, useMemo } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import TimeRangeSelector from './common/TimeRangeSelector';
import ProductivityTrends from './analytics/ProductivityTrends';
import SiteCategories from './analytics/SiteCategories';
import ProductivityScore from './analytics/ProductivityScore';
import SiteDetailsModal from './analytics/SiteDetailsModal';
import SiteUsageChart from './analytics/SiteUsageChart';
import ProductivityInsights from './analytics/ProductivityInsights';

const Reports = () => {
  const [timeRange, setTimeRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const { analytics, loading } = useAnalytics(timeRange.startDate, timeRange.endDate);

  const categories = useMemo(() => [
    {
      name: 'Work',
      timeSpent: analytics?.categoryStats?.work || 0,
      color: '#4ade80'
    },
    {
      name: 'Social',
      timeSpent: analytics?.categoryStats?.social || 0,
      color: '#60a5fa'
    },
    {
      name: 'Entertainment',
      timeSpent: analytics?.categoryStats?.entertainment || 0,
      color: '#f472b6'
    },
    {
      name: 'Other',
      timeSpent: analytics?.categoryStats?.other || 0,
      color: '#94a3b8'
    }
  ], [analytics]);

  const trends = useMemo(() => {
    if (!analytics?.dailyStats) return [];
    return analytics.dailyStats.map(stat => ({
      label: new Date(stat.date).toLocaleDateString('en-US', { weekday: 'short' }),
      value: Math.round(stat.productivityScore * 100)
    }));
  }, [analytics]);

  const [selectedSite, setSelectedSite] = useState(null);

  if (loading) {
    return <div className="p-4">Loading reports...</div>;
  }

  return (
    <div className="p-4">
      <TimeRangeSelector timeRange={timeRange} onChange={setTimeRange} />

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium mb-2">Overall Productivity</h3>
              <p className="text-sm text-gray-500">
                Based on your activity patterns
              </p>
            </div>
            <ProductivityScore 
              score={analytics?.summary?.productivityScore || 0} 
            />
          </div>
        </div>

        <ProductivityInsights 
          data={{
            mostProductiveHour: analytics?.insights?.mostProductiveHour,
            leastProductiveHour: analytics?.insights?.leastProductiveHour,
            peakFocusTime: analytics?.insights?.peakFocusTime,
            distractionCount: analytics?.insights?.distractionCount
          }}
        />

        <ProductivityTrends data={trends} />
        <SiteUsageChart 
          data={{
            hourlyUsage: analytics?.hourlyPatterns,
            weeklyUsage: analytics?.weeklyPatterns,
            monthlyUsage: analytics?.monthlyPatterns
          }}
        />
        <SiteCategories categories={categories} />

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Most Productive Sites</h3>
            <div className="space-y-2">
              {analytics?.insights?.topProductiveSites?.map(site => (
                <div 
                  key={site.domain} 
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => setSelectedSite(site)}
                >
                  <span className="text-sm truncate">{site.domain}</span>
                  <span className="text-sm text-green-600 ml-2">
                    {Math.round(site.timeSpent / 60000)}m
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-medium mb-2">Top Distractions</h3>
            <div className="space-y-2">
              {analytics?.insights?.distractions?.map(site => (
                <div key={site.domain} className="flex justify-between">
                  <span className="text-sm truncate">{site.domain}</span>
                  <span className="text-sm text-red-600 ml-2">
                    {Math.round(site.timeSpent / 60000)}m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedSite && (
        <SiteDetailsModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
        />
      )}
    </div>
  );
};

export default Reports; 