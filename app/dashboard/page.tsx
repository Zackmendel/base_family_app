"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FamilyCard, SpendChart, SpendControl } from "@/components";
import {
  mockFamilyMembers,
  mockSpendChartData,
  mockSpendControlData,
} from "@/lib/mockData";

export default function DashboardPage() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  const handleMemberClick = (id: string) => {
    setSelectedMember(id);
    console.log("Member clicked:", id);
  };

  const handleMemberEdit = (id: string) => {
    console.log("Edit member:", id);
  };

  const handleToggleStatus = (id: string, isActive: boolean) => {
    console.log("Toggle status:", id, isActive);
  };

  const handleCategoryClick = (category: string) => {
    console.log("Category clicked:", category);
  };

  const handleLimitChange = (
    memberId: string,
    period: "daily" | "weekly" | "monthly",
    newLimit: number
  ) => {
    console.log("Limit changed:", memberId, period, newLimit);
  };

  const handlePeriodChange = (
    memberId: string,
    period: "daily" | "weekly" | "monthly"
  ) => {
    console.log("Period changed:", memberId, period);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Family Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your family's spending and financial activities
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Family Members
            </h2>
            <div className="space-y-4">
              {mockFamilyMembers.map((member) => (
                <FamilyCard
                  key={member.id}
                  data={member}
                  onClick={handleMemberClick}
                  onEdit={handleMemberEdit}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Spending Overview
              </h2>
              <SpendChart
                data={mockSpendChartData}
                onCategoryClick={handleCategoryClick}
              />
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Spending Controls
              </h2>
              <SpendControl
                data={mockSpendControlData}
                onLimitChange={handleLimitChange}
                onPeriodChange={handlePeriodChange}
              />
            </div>
          </div>
        </div>

        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg"
          >
            Selected member: {selectedMember}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
