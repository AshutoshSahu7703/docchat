export default function Logo({ size = 'text-xl' }) {
  return (
    <span className={`font-display font-bold ${size} tracking-tight`}>
      Doc<span className="mark px-0.5">Chat</span>
    </span>
  );
}
