import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, LogIn, UserPlus, Menu, X, BarChart3, Bell, Camera } from 'lucide-react';

const navItems = [
	// { path: '/', label: 'Home', icon: Home }, // Home removed
	{ path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
	{ path: '/alerts', label: 'Alerts & Chat', icon: Bell },
	{ path: '/cropDetection', label: 'Crop Detection', icon: Leaf },
	{ path: '/crop-disease', label: 'Disease Detection', icon: Camera },
	// { path: '/maps', label: 'Maps', icon: MapPin }, // Maps removed
	{ path: '/login', label: 'Sign In', icon: LogIn },
	{ path: '/register', label: 'Sign Up', icon: UserPlus },
];

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);

	const navLinkClass = ({ isActive }: { isActive: boolean }) =>
		`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-all duration-200 ${
			isActive
				? 'bg-primary text-white shadow ring-2 ring-primary'
				: 'text-muted-foreground hover:text-foreground hover:bg-accent'
		}`;

	return (
		<nav className="bg-background/95 backdrop-blur-lg border-b border-border sticky top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex items-center">
						{/* Logo: clicking EcoClime goes to index.tsx ("/") */}
						<Link to="/" className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
								<Leaf className="w-5 h-5 text-primary-foreground" />
							</div>
							<span className="text-xl font-bold text-foreground">EcoClime</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center">
						<div className="flex items-center space-x-4">
							{navItems
								.filter(
									(item) =>
										item.path !== '/login' && item.path !== '/register'
								)
								.map((item) => {
									const Icon = item.icon;
									return (
										<NavLink key={item.path} to={item.path} className={navLinkClass} end>
											<Icon className="w-4 h-4" />
											<span>{item.label}</span>
										</NavLink>
									);
								})}
						</div>
						{/* Space between Disease Detector and Sign In */}
						<div style={{ width: 32 }} />
						<div className="flex items-center space-x-2">
							<NavLink
								to="/login"
								className="flex items-center space-x-1 px-4 py-2 rounded-md font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200"
							>
								<LogIn className="w-4 h-4" />
								<span>Sign In</span>
							</NavLink>
							<NavLink
								to="/register"
								className="flex items-center space-x-1 px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700 transition-all duration-200"
							>
								<UserPlus className="w-4 h-4" />
								<span>Sign Up</span>
							</NavLink>
						</div>
					</div>
					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => setIsOpen(!isOpen)}
							className="text-muted-foreground"
						>
							{isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			{isOpen && (
				<div className="md:hidden bg-background border-t border-border">
					<div className="px-2 pt-2 pb-3 space-y-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<NavLink
									key={item.path}
									to={item.path}
									className={({ isActive }) =>
										`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
											isActive
												? 'bg-primary text-white shadow ring-2 ring-primary'
												: 'text-muted-foreground hover:text-foreground hover:bg-accent'
										}`
									}
									end
									onClick={() => setIsOpen(false)}
								>
									<Icon className="w-5 h-5" />
									<span>{item.label}</span>
								</NavLink>
							);
						})}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;


