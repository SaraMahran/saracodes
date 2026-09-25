import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { ProjectCaseStudy, ProjectPager } from '@/components/ProjectCaseStudy';
import type { Project } from '@/data/types';

const TITLE_ID = 'project-modal-title';

interface ProjectDialogProps {
  open: boolean;
  project: Project;
  index: number;
  total: number;
  onClose: () => void;
  onExitComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

/** Case study dialog with previous / next navigation (lazy-loaded). */
export function ProjectDialog({
  open,
  project,
  index,
  total,
  onClose,
  onExitComplete,
  onPrevious,
  onNext,
}: ProjectDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={TITLE_ID}
      onExitComplete={onExitComplete}
      size="lg"
      scrollKey={project.id}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={project.id}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.18 }}
        >
          <ProjectCaseStudy project={project} titleId={TITLE_ID} />
        </motion.div>
      </AnimatePresence>
      {/* Outside the swapping content so focus stays on the pager buttons. */}
      <div className="mt-6">
        <ProjectPager index={index} total={total} onPrevious={onPrevious} onNext={onNext} />
      </div>
    </Modal>
  );
}
