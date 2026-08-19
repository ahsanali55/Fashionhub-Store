interface FashionHubLogoProps {
  light?: boolean;
}

export const FashionHubLogo = ({
  light = false,
}: FashionHubLogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 240"
    className="w-12 h-12"
    aria-label="FashionHub Logo"
    role="img"
  >
    {/* F */}
    <path
      d="
        M48 42
        H148
        V70
        H82
        V98
        H135
        V124
        H82
        V190
        H48
        Z
      "
      fill="#FF6B00"
    />
    <path
      d="
        M155 42
        H190
        V98
        H230
        V42
        H265
        V190
        H230
        V128
        H190
        V190
        H155
        Z
      "
      fill={light ? "#FFFFFF" : "#1F2937"}
    />
    <path
      d="
        M105 157
        C145 132 205 119 270 83
        C258 113 230 137 194 151
        C162 163 132 172 112 185
        C102 191 94 184 95 174
        C96 168 100 162 105 157
        Z
      "
      fill="#FF6B00"
    />
  </svg>
);