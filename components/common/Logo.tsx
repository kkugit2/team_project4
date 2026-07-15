import styles from "./Logo.module.css";

export function Logo({ name, color, size = "md" }: { name: string; color: string; size?: "sm" | "md" | "lg" }) {
  return (
    <div className={`${styles.logo} ${styles[size]}`} style={{ background: color }}>
      {name.charAt(0)}
    </div>
  );
}
