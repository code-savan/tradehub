import { Menu, Search, Bell } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  onMenuClick: () => void;
  onSearchClick?: () => void;
  showNotifications?: boolean;
  onNotificationsClick?: () => void;
  notificationCount?: number;
}

export default function MobileHeader({
  title,
  onMenuClick,
  onSearchClick,
  showNotifications = false,
  onNotificationsClick,
  notificationCount = 0
}: MobileHeaderProps) {
  return (
    <header className="lg:hidden bg-deep-black/50 backdrop-blur-xl border-b border-white/10 px-4 py-4 sticky top-0 z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {onSearchClick && (
            <button
              onClick={onSearchClick}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {showNotifications && onNotificationsClick && (
            <button
              onClick={onNotificationsClick}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
