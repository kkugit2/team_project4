import Image from "next/image";
import styles from "./Logo.module.css";

export function Logo({
  name,
  color,
  size = "md",
  imageUrl,
}: {
  name: string;
  color: string;
  size?: "sm" | "md" | "lg";
  imageUrl?: string;
}) {
  // 이미지 URL이 있고 유효하면 이미지 표시, 아니면 텍스트 표시
  if (imageUrl) {
    return (
      <div className={`${styles.logo} ${styles[size]}`} style={{ background: color, overflow: "hidden" }}>
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: "cover" }}
          onError={(e) => {
            // 이미지 로딩 실패 시 텍스트로 폴백
            const container = e.currentTarget.parentElement;
            if (container) {
              container.innerHTML = name.charAt(0);
            }
          }}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.logo} ${styles[size]}`} style={{ background: color }}>
      {name.charAt(0)}
    </div>
  );
}
