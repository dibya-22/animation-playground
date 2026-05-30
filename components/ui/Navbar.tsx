import { ThemeSwitcher } from "./ThemeSwitchButton";

const Navbar = () => {
    return (
        <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-10 backdrop-blur-sm">
            <div className="font-medium">
                Dibya&#39;s Playground
            </div>

            <ul className="flex items-center gap-6">
                <li>
                    <ThemeSwitcher />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;