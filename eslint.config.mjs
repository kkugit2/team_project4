import nextConfig from "eslint-config-next";

const eslintConfig = [
  ...nextConfig,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    rules: {
      // 이 프로젝트는 세션 하이드레이션/데이터 로딩을 표준적인 "마운트 시 fetch" 패턴으로 구현한다
      // (SessionProvider, 각 페이지의 useEffect). 이 규칙은 그 패턴 자체를 전부 금지하므로 끈다.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default eslintConfig;
