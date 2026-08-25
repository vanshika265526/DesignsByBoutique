import Navbar from "@/components/layout/Navbar";
import AnnouncementBanner from "@/components/layout/AnnouncementBanner";
import Footer from "@/components/layout/Footer";
import FloatingWhatsApp from "@/components/layout/FloatingWhatsApp";
import RouteLoadingBar from "@/components/layout/RouteLoadingBar";

export default function PublicLayout({ children }) {
    return (
        <>
            <RouteLoadingBar />
            <AnnouncementBanner />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}
