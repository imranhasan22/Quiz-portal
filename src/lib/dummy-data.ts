

import React from "react";

export type MyRole = {
  id: number;
  name: string;
  createdAt: string;
  permissions: string[];
};

export type Group = {
  key: string;
  icon?: React.ReactNode;
  title: string;
  items: { key: string; label: string }[];
};

export const SAMPLE_ROLES: MyRole[] = [
  {
    id: 1,
    name: "Agent",
    createdAt: "October 8, 2025 12:42 PM",
    permissions: ["view_user","quiz_activity","quiz_create"],
  },
  {
    id: 2,
    name: "User",
    createdAt: "October 8, 2025 12:42 PM",
    permissions: ["view_user"],
  },
  {
    id: 3,
    name: "Admin",
    createdAt: "October 8, 2025 12:42 PM",
    permissions: [
      "quiz_activity",
      "user_table",
      "create_user",
      "remove_user",
      "view_user",
      "create_question",
      "view_question",
      "quiz_create",
      "quiz_edit",
    ],
  },
  {
    id: 4,
    name: "Super Admin",
    createdAt: "October 8, 2025 12:42 PM",
    permissions: [
      "quiz_activity",
      "process_ratio",
      "user_table",
      "create_user",
      "remove_user",
      "view_user",
      "create_question",
      "view_question",
      "edit_question",
      "upload_question",
      "export_question",
      "quiz_create",
      "quiz_upload",
      "quiz_export",
      "quiz_edit",
      "result_export",
      "view_result",
      "report_export",
      "report_delete",
    ],
  },
];

// ===== PERMISSION GROUPS =====
export const GROUPS: Group[] = [
  {
    key: "dashboard",
    title: "Dashboard",
  
    items: [
      { key: "quiz_activity", label: "Quiz’s Activity" },
      { key: "process_ratio", label: "Process Wise Pass & Fail Ratio" },
    ],
  },
  {
    key: "user",
    title: "User",
  
    items: [
      { key: "user_table", label: "User Table" },
      { key: "create_user", label: "Create User" },
      { key: "remove_user", label: "Remove User" },
      { key: "view_user", label: "View User" },
    ],
  },
  {
    key: "question",
    title: "Question",
 
    items: [
      { key: "create_question", label: "Question Create" },
      { key: "view_question", label: "View Question" },
      { key: "edit_question", label: "Edit Question" },
      { key: "upload_question", label: "Upload Question" },
      { key: "export_question", label: "Export Question" },
    ],
  },
  {
    key: "quiz",
    title: "Quiz",
 
    items: [
      { key: "quiz_create", label: "Quiz Create" },
      { key: "quiz_upload", label: "Upload Quiz" },
      { key: "quiz_export", label: "Export Quiz" },
      { key: "quiz_edit", label: "Edit Quiz" },
    ],
  },
  {
    key: "result",
    title: "Result",
  
    items: [
      { key: "result_export", label: "Result Export" },
      { key: "view_result", label: "View Result" },
    ],
  },
  {
    key: "report",
    title: "Report",
   
    items: [
      { key: "report_export", label: "Report Export" },
      { key: "report_delete", label: "Report Delete" },
    ],
  },
];
