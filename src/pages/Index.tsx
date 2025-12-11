import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Lock, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { parseMarkdown } from '@/lib/parseMarkdown';
import { useMarathonStore } from '@/hooks/useMarathonStore';
import { useAuth } from '@/hooks/useAuth';
import { Header } from '@/components/dashboard/Header';
import { DomainFilter } from '@/components/dashboard/DomainFilter';
import { CycleWheel } from '@/components/dashboard/CycleWheel';
import { CycleInfo } from '@/components/dashboard/CycleInfo';
import { MissionCardGrid } from '@/components/dashboard/MissionCardGrid';
import { StatsPanel } from '@/components/dashboard/StatsPanel';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import timetableRaw from '@/data/timetable.md?raw';

export default function Index() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authentication
  const { isAuthenticated, loading: authLoading, login, logout } = useAuth();

  // Parse the markdown on load
  const [cycles, setCycles] = useState<ReturnType<typeof parseMarkdown>>([]);

  useEffect(() => {
    const parsed = parseMarkdown(timetableRaw);
    setCycles(parsed);
    setIsLoading(false);
  }, []);

  const store = useMarathonStore(cycles);

  // Debug logging
  useEffect(() => {
    console.log('Index page state:', {
      cyclesCount: cycles.length,
      selectedCycle: store.selectedCycle,
      currentCycleData: cycles.find(c => c.cycleNum === store.selectedCycle),
      activeDomainFilters: store.activeDomainFilters,
      filteredDays: store.filteredDays,
      filteredDaysCount: store.filteredDays.length,
    });
  }, [cycles, store.selectedCycle, store.activeDomainFilters, store.filteredDays]);

  // Keyboard shortcuts - temporarily disabled for debugging
  // TODO: Re-enable after fixing dependency issues
  /*
  const { handleKeyDown } = useKeyboardShortcuts({
    onPreviousCycle: () => store.setSelectedCycle(Math.max(0, store.selectedCycle - 1)),
    onNextCycle: () => store.setSelectedCycle(Math.min(cycles.length - 1, store.selectedCycle + 1)),
    onFirstCycle: () => store.setSelectedCycle(0),
    onLastCycle: () => store.setSelectedCycle(cycles.length - 1),
    onClose: () => store.setExpandedDay(null),
    onShowHelp: () => console.log('Help shortcuts: Arrow keys/WASD = navigate, 1-9/0 = jump to cycle, Esc = close, Shift+? = help')
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, store.selectedCycle, cycles.length]);
  */

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background grid-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm text-muted-foreground">
            Parsing 7000+ lines...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background grid-bg scanlines">
      <Header stats={store.stats} />

      <div className="container mx-auto px-4 py-6">
        {/* Mobile controls + Login Button */}
        <div className="flex lg:hidden gap-2 mb-4 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="flex-1"
          >
            <Menu className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMobileStats(!showMobileStats)}
            className="flex-1"
          >
            Stats
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/list-view')}
            className="flex-1"
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
          <Button
            variant={isAuthenticated ? 'secondary' : 'default'}
            size="sm"
            onClick={() => {
              if (isAuthenticated) {
                logout();
              } else {
                setShowAuthModal(true);
              }
            }}
            className="flex-1 lg:w-auto"
          >
            <Lock className="w-4 h-4 mr-2" />
            {isAuthenticated ? 'Logout' : 'Login'}
          </Button>
        </div>

        {/* Desktop Login Button */}
        <div className="hidden lg:flex justify-end gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/list-view')}
            className="flex items-center gap-2"
          >
            <List className="w-4 h-4" />
            List View
          </Button>
          <Button
            variant={isAuthenticated ? 'secondary' : 'default'}
            size="sm"
            onClick={() => {
              if (isAuthenticated) {
                logout();
              } else {
                setShowAuthModal(true);
              }
            }}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isAuthenticated ? 'Logout' : 'Login to Edit'}
          </Button>
        </div>

        <div className="flex gap-6">
          {/* Left Sidebar - Domain Filter */}
          <div className={`
            fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
            lg:w-64 lg:shrink-0
            ${showMobileSidebar ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile overlay */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />

            <div className="relative lg:static w-72 lg:w-full h-full lg:h-auto overflow-y-auto p-4 lg:p-0 scrollbar-thin">
              <div className="lg:hidden flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileSidebar(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <DomainFilter
                activeDomains={store.activeDomainFilters}
                domainStats={store.domainStats}
                onToggleDomain={store.toggleDomainFilter}
                onReset={store.resetFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Cycle Wheel */}
            <div className="mb-8">
              <CycleWheel
                cycles={store.cycles}
                selectedCycle={store.selectedCycle}
                onSelectCycle={store.setSelectedCycle}
                completedDays={store.progress.completedDays}
              />
            </div>

            {/* Cycle Info */}
            <CycleInfo
              cycle={store.currentCycleData}
              completedDays={store.progress.completedDays}
            />

            {/* Mission Cards */}
            <MissionCardGrid
              days={store.filteredDays}
              expandedDay={store.expandedDay}
              onToggleExpand={(dayNum) => store.setExpandedDay(dayNum === store.expandedDay ? null : dayNum)}
              isDayCompleted={store.isDayCompleted}
              onToggleComplete={store.toggleDayComplete}
              getDayNote={store.getDayNote}
              onUpdateNote={store.updateNote}
              isEditable={isAuthenticated}
              isSkipped={store.isSkipped}
              onToggleSkip={store.toggleSkip}
              getStudyTime={store.getStudyTime}
              onUpdateTime={store.updateStudyTime}
            />
          </main>

          {/* Right Sidebar - Stats Panel */}
          <div className={`
            fixed lg:relative inset-0 lg:inset-auto z-40 lg:z-auto
            lg:w-72 lg:shrink-0
            ${showMobileStats ? 'block' : 'hidden lg:block'}
          `}>
            {/* Mobile overlay */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileStats(false)}
            />

            <div className="relative lg:static w-80 lg:w-full h-full lg:h-auto overflow-y-auto p-4 lg:p-0 ml-auto scrollbar-thin">
              <div className="lg:hidden flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileStats(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <StatsPanel
                stats={store.stats}
                domainStats={store.domainStats}
                selectedCycle={store.selectedCycle}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer isAuthenticated={isAuthenticated} />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onLogin={(password) => {
          const success = login(password);
          if (success) {
            setShowAuthModal(false);
          }
          return success;
        }}
      />
    </div>
  );
}
