import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">TP</span>
            </div>
            <span className="font-semibold">Tricher Partners</span>
          </div>

          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <Link to="/support" className="hover:text-foreground transition-colors">
              Support
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Tricher Partners. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
