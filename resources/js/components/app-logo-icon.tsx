export default function AppLogoIcon({ className = '' }) {
    return (
        <div
            className={`bg-current ${className}`}
            style={{
                WebkitMask: 'url(/favicon.png) no-repeat center',
                mask: 'url(/favicon.png) no-repeat center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
            }}
        />
    );
}
