import { Link, useLocation } from 'react-router';
import { BookOpen, Search, User, Menu, LogIn, LogOut, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ShoppingCartSheet } from './ShoppingCart';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { AuthModal } from './AuthModal';

export function Header() {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/courses', label: 'Courses' },
    { path: '/dashboard', label: 'My Learning' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" style={{ color: '#4F772D' }} />
              <span className="font-bold text-xl">LearnHub</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors ${
                    isActive(link.path) ? 'text-gray-700' : 'text-gray-700'
                  }`}
                  style={isActive(link.path) ? { color: '#4F772D' } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 max-w-xs">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-10 w-full"
                />
              </div>
            </div>

            <ShoppingCartSheet />

            {/* User Menu / Login Button */}
            {isAuthenticated && user ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: '#4F772D' }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border z-50 py-2">
                      <div className="px-4 py-3 border-b">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link 
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <UserCircle className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        <Link 
                          to="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <BookOpen className="h-4 w-4" />
                          <span>My Learning</span>
                        </Link>
                      </div>
                      <div className="border-t py-1">
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="hidden sm:inline-flex gap-2 bg-green-700 hover:bg-green-800"
              >
                <LogIn className="h-4 w-4" />
                Log In
              </Button>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`text-lg transition-colors hover:text-green-700 ${
                        isActive(link.path) ? 'text-green-700' : 'text-gray-700'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="search"
                      placeholder="Search courses..."
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center gap-3 mb-4">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: '#4F772D' }}
                          >
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user.name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <Link to="/profile">
                          <Button variant="outline" className="w-full mb-2 gap-2">
                            <UserCircle className="h-4 w-4" />
                            My Profile
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full gap-2 text-red-600 border-red-200"
                          onClick={logout}
                        >
                          <LogOut className="h-4 w-4" />
                          Log Out
                        </Button>
                      </>
                    ) : (
                      <Button 
                        onClick={() => setShowAuthModal(true)}
                        className="w-full gap-2 bg-green-700 hover:bg-green-800"
                      >
                        <LogIn className="h-4 w-4" />
                        Log In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}