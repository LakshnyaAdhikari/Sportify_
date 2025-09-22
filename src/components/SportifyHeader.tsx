import { Button } from "@/components/ui/button";
import { Menu, Bell, User } from "lucide-react";
import sportifyLogo from "@/assets/sportify-logo.jpg";

interface SportifyHeaderProps {
  onMenuClick?: () => void;
  showNotifications?: boolean;
  userName?: string;
}

const SportifyHeader = ({ onMenuClick, showNotifications = true, userName }: SportifyHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-saffron/20 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <Button variant="ghost" size="icon-sm" onClick={onMenuClick} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <img src={sportifyLogo} alt="Sportify" className="h-8 w-8 rounded-lg" />
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-saffron">Sportify</h1>
              <p className="text-xs text-muted-foreground leading-none">अपनी प्रतिभा खोलें</p>
            </div>
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button variant="ghost" size="icon-sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-saffron animate-pulse"></span>
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            {userName && (
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-neutral-dark">नमस्ते, {userName}!</p>
                <p className="text-xs text-muted-foreground">चैंपियन बनने के लिए तैयार?</p>
              </div>
            )}
            <Button variant="floating" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SportifyHeader;