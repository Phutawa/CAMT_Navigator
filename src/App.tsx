import { useState } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewScreen } from './components/OverviewScreen';
import { AllocationScreen } from './components/AllocationScreen';
import { DisbursementScreen } from './components/DisbursementScreen';
import { ReportsScreen } from './components/ReportsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { BudgetReductionModal } from './components/BudgetReductionModal';
import { CloseProjectModal } from './components/CloseProjectModal';
import { PlanEditModal } from './components/PlanEditModal';
import { DocumentExportPreviewModal, ExportDocumentType } from './components/DocumentExportPreviewModal';
import { ToastContainer } from './components/Toast';
import {
  INITIAL_CATEGORIES,
  INITIAL_DEPARTMENTS,
  INITIAL_PROJECTS,
  ProjectItem,
  DepartmentSummary,
  QuarterType,
} from './data/mockData';

interface ToastItem {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description: string;
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [syncTime, setSyncTime] = useState('5 นาทีที่แล้ว');

  // Sidebar collapsible state for full-screen reading
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Quarter selection state (All, Q1, Q2, Q3, Q4)
  const [selectedQuarter, setSelectedQuarter] = useState<QuarterType>('q3');

  // Interactive Live Data State
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [departments, setDepartments] = useState<DepartmentSummary[]>(INITIAL_DEPARTMENTS);
  const [centralReserve, setCentralReserve] = useState<number>(3450000);
  const [pendingApproved, setPendingApproved] = useState<boolean>(false);

  // Modals state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const [isReduceModalOpen, setIsReduceModalOpen] = useState(false);
  const [projectToReduce, setProjectToReduce] = useState<ProjectItem | null>(null);

  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [projectToClose, setProjectToClose] = useState<ProjectItem | null>(null);

  const [isPlanEditOpen, setIsPlanEditOpen] = useState(false);

  // Universal Document Export Preview Modal state
  const [isDocExportPreviewOpen, setIsDocExportPreviewOpen] = useState(false);
  const [exportDocType, setExportDocType] = useState<ExportDocumentType>('overview');
  const [singleProjectForExport, setSingleProjectForExport] = useState<ProjectItem | null>(null);

  // Toast Notifications state
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (type: ToastItem['type'], title: string, description: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync refresh
  const handleRefreshSync = () => {
    setSyncTime('เพิ่งอัปเดตเมื่อสักครู่');
    addToast('info', 'ซิงก์ข้อมูล CMU ERP สำเร็จ', 'ระบบได้ทำการดึงยอดเงินและสถานะล่าสุดจากศูนย์ข้อมูล');
  };

  // Trigger preview for specific document types
  const handleTriggerExportPreview = (docType: ExportDocumentType, project?: ProjectItem) => {
    setExportDocType(docType);
    if (project) {
      setSingleProjectForExport(project);
    }
    setIsDocExportPreviewOpen(true);
  };

  // Detail Modal Open
  const handleOpenDetailModal = (prj?: ProjectItem) => {
    setSelectedProject(prj || projects[0]);
    setIsDetailModalOpen(true);
  };

  // Reduction Modal Open
  const handleOpenReduceModal = (prj: ProjectItem) => {
    setProjectToReduce(prj);
    setIsReduceModalOpen(true);
  };

  // Handle Budget Reduction Confirm
  const handleConfirmReduce = (projectId: string, reduceAmount: number, reason: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const newAllocated = p.allocated - reduceAmount;
          const newPct = Number(((p.spent / newAllocated) * 100).toFixed(1));
          return {
            ...p,
            allocated: newAllocated,
            completionPct: Math.min(100, newPct),
          };
        }
        return p;
      })
    );

    setCentralReserve((prev) => prev + reduceAmount);

    addToast(
      'warning',
      'ปรับลดงบประมาณสำเร็จ',
      `ปรับลดยอดเงิน ฿${reduceAmount.toLocaleString()} คืนกองทุนสำรองส่วนกลาง (${reason})`
    );
  };

  // Close Project Modal Open
  const handleOpenCloseModal = (prj: ProjectItem) => {
    setProjectToClose(prj);
    setIsCloseModalOpen(true);
  };

  // Handle Close Project Confirm
  const handleConfirmCloseProject = () => {
    if (!projectToClose) return;
    const refund = projectToClose.allocated - projectToClose.spent;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectToClose.id) {
          return {
            ...p,
            status: 'approved',
            allocated: p.spent,
            completionPct: 100,
          };
        }
        return p;
      })
    );

    if (refund > 0) {
      setCentralReserve((prev) => prev + refund);
    }

    setIsCloseModalOpen(false);
    addToast(
      'success',
      'ปิดโครงการสมบูรณ์',
      `ปิดโครงการ "${projectToClose.title}" และโอนคืนเงินเหลือ ฿${refund.toLocaleString()} สู่คลังกลาง`
    );
  };

  // Approve Pending Items
  const handleToggleApprovePending = () => {
    const newState = !pendingApproved;
    setPendingApproved(newState);
    if (newState) {
      addToast('success', 'อนุมัติ 5 รายการค้างสำเร็จ', 'ลงนามรับรองใบเบิกจ่ายและเอกสารผูกพันงบทั้งหมดใน Q3 เรียบร้อย');
    } else {
      addToast('info', 'ยกเลิกการอนุมัติ', 'ย้อนสถานะรายการกลับสู่รอการตรวจสอบ');
    }
  };

  // Save Plan Modification
  const handleSavePlanEdit = (updatedDepts: DepartmentSummary[]) => {
    setDepartments(updatedDepts);
    const newTotalDept = updatedDepts.reduce((s, d) => s + d.amount, 0);
    setCentralReserve(12000000 - newTotalDept);
    addToast('success', 'บันทึกการปรับแก้แผนงบประมาณ', 'บันทึกกรอบจัดสรรใหม่ให้ 6 ส่วนงานเรียบร้อย');
  };

  // Total sums
  const totalAllocated = 12000000;
  const totalSpent = projects.reduce((acc, p) => acc + p.spent, 0);

  // Projects filtered by current quarter
  const exportProjects = selectedQuarter === 'all'
    ? projects
    : projects.filter((p) => p.quarter === selectedQuarter);

  const quarterLabels: Record<QuarterType, string> = {
    all: 'ทุกไตรมาส (ปีงบประมาณ 2569)',
    q1: 'ไตรมาส 1 (ต.ค. - ธ.ค. 2568)',
    q2: 'ไตรมาส 2 (ม.ค. - มี.ค. 2569)',
    q3: 'ไตรมาส 3 (เม.ย. - มิ.ย. 2569)',
    q4: 'ไตรมาส 4 (ก.ค. - ก.ย. 2569)',
  };

  return (
    <div className="min-h-screen flex bg-[#f7f9ff] text-[#181c20]">
      {/* Collapsible Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingCount={pendingApproved ? 0 : 3}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content Area - shifts dynamically with sidebar width */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'pl-20' : 'pl-72'
        }`}
      >
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          syncTime={syncTime}
          onRefreshSync={handleRefreshSync}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="w-full max-w-[1600px] mx-auto px-6 sm:px-8 pt-28 pb-12">
          {currentTab === 'overview' && (
            <OverviewScreen
              categories={INITIAL_CATEGORIES}
              projects={projects}
              searchQuery={searchQuery}
              centralReserve={centralReserve}
              totalAllocated={totalAllocated}
              totalSpent={totalSpent}
              selectedQuarter={selectedQuarter}
              onChangeQuarter={(q) => {
                setSelectedQuarter(q);
                addToast('info', `สลับมุมมอง ${q.toUpperCase()}`, `แสดงผลโครงการและตัวชี้วัดประจำ ${quarterLabels[q]}`);
              }}
              onOpenProjectModal={handleOpenDetailModal}
              onOpenReduceModal={handleOpenReduceModal}
              onOpenCloseModal={handleOpenCloseModal}
              pendingApproved={pendingApproved}
              onToggleApprovePending={handleToggleApprovePending}
              onExportReport={() => handleTriggerExportPreview('overview')}
            />
          )}

          {currentTab === 'allocation' && (
            <AllocationScreen
              departments={departments}
              onCommitSuccess={() => {
                addToast('success', 'ลงนามอนุมัติการจัดสรรงบประมาณสำเร็จ', 'บันทึกผ่านระบบ CMU SSO เรียบร้อย');
              }}
              onOpenEditModal={() => setIsPlanEditOpen(true)}
              onExportReport={() => handleTriggerExportPreview('allocation')}
            />
          )}

          {currentTab === 'disbursement' && (
            <DisbursementScreen
              onNotifyAlert={() => {
                addToast('warning', 'ส่งการแจ้งเตือนเร่งรัดแล้ว', 'ส่งบันทึกติดตามผ่านระบบไปยังโครงการที่เบิกจ่ายล่าช้า');
              }}
              onApprovePO={(poNo) => {
                addToast('success', 'อนุมัติเบิกจ่ายสำเร็จ', `ตรวจรับและอนุมัติใบสั่งซื้อ ${poNo} เรียบร้อย`);
              }}
              onExportReport={() => handleTriggerExportPreview('disbursement')}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsScreen
              onExportReport={() => handleTriggerExportPreview('reports')}
              onSignedSuccess={() => {
                addToast('success', 'รับรองรายงานสถิติแล้ว', 'ลงนามผ่านระบบ EdPEx เรียบร้อย');
              }}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              onCommitSuccess={() => {
                addToast('success', 'บันทึกการตั้งค่าระบบแล้ว', 'อัปเดตเกณฑ์ควบคุมและธรรมาภิบาลการเงินเรียบร้อย');
              }}
              onTestAPISuccess={() => {
                addToast('info', 'ทดสอบ API Gateway สำเร็จ', 'การเชื่อมต่อ CMU-ERP, GFMIS, และ SSO เสถียรดี (Latency < 1s)');
              }}
              onExportReport={() => handleTriggerExportPreview('settings')}
            />
          )}
        </main>
      </div>

      {/* Modal for Project Detail Preview */}
      <ProjectDetailModal
        isOpen={isDetailModalOpen}
        project={selectedProject}
        onClose={() => setIsDetailModalOpen(false)}
        onApproveSuccess={() => {
          addToast('success', 'อนุมัติรับรองรายงานโครงการ', 'ลงนามรับรองความก้าวหน้างวดที่ 2 เรียบร้อย');
        }}
        onExportPreview={(prj) => handleTriggerExportPreview('project_detail', prj)}
      />

      {/* Modal for Budget Reduction */}
      <BudgetReductionModal
        isOpen={isReduceModalOpen}
        project={projectToReduce}
        onClose={() => setIsReduceModalOpen(false)}
        onConfirm={handleConfirmReduce}
      />

      {/* Modal for Close Project */}
      <CloseProjectModal
        isOpen={isCloseModalOpen}
        projectTitle={projectToClose ? projectToClose.title : ''}
        refundAmount={projectToClose ? projectToClose.allocated - projectToClose.spent : 0}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleConfirmCloseProject}
      />

      {/* Modal for Edit Allocation Plan */}
      <PlanEditModal
        isOpen={isPlanEditOpen}
        departments={departments}
        onClose={() => setIsPlanEditOpen(false)}
        onSave={handleSavePlanEdit}
      />

      {/* Universal Document Export Preview Modal - triggers on ANY Print/Export button across all screens */}
      <DocumentExportPreviewModal
        isOpen={isDocExportPreviewOpen}
        onClose={() => setIsDocExportPreviewOpen(false)}
        docType={exportDocType}
        quarterLabel={quarterLabels[selectedQuarter]}
        projects={exportProjects}
        departments={departments}
        totalAllocated={selectedQuarter === 'all' ? totalAllocated : exportProjects.reduce((s, p) => s + p.allocated, 0)}
        totalSpent={selectedQuarter === 'all' ? totalSpent : exportProjects.reduce((s, p) => s + p.spent, 0)}
        centralReserve={centralReserve}
        projectDetail={singleProjectForExport || selectedProject}
      />

      {/* Toast System */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
