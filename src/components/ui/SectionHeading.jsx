export default function SectionHeading({
    badge,
    title,
    subtitle,
    centered = true,
    className = "",
}) {
    return (
        <div className={`space-y-3 ${centered ? "text-center" : "text-left"} ${className}`}>
            {badge && (
                <span className="inline-block px-3 py-1 bg-boutique-blush/60 text-boutique-rose text-[11px] font-medium tracking-[0.2em] uppercase rounded-full border border-boutique-rose/10">
                    {badge}
                </span>
            )}
            {title && (
                <h2 className="font-serif-editorial text-3xl sm:text-4xl md:text-5xl text-boutique-charcoal leading-tight">
                    {title}
                </h2>
            )}
            {subtitle && (
                <p className="text-sm sm:text-base text-boutique-taupe max-w-2xl font-light leading-relaxed mx-auto">
                    {subtitle}
                </p>
            )}
            <div className={`pt-2 flex items-center ${centered ? "justify-center" : "justify-start"}`}>
                <span className="w-12 h-[1px] bg-boutique-gold/60 inline-block" />
                <span className="w-1.5 h-1.5 rounded-full bg-boutique-rose inline-block mx-2" />
                <span className="w-12 h-[1px] bg-boutique-gold/60 inline-block" />
            </div>
        </div>
    );
}
