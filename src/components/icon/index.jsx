import React from "react";
import Home from "@/components/icon/svg/home.svg";
import Collections from "@/components/icon/svg/collections.svg";
import Answers from "@/components/icon/svg/answers.svg";
import Settings from "@/components/icon/svg/settings.svg";
import ExternalLink from "@/components/icon/svg/externalLink.svg";
import CheckFilled from "@/components/icon/svg/checkFilled.svg";
import LogoWithName from "@/components/icon/svg/logo-with-name.svg";
import GoogleLogo from "@/components/icon/svg/google-logo.svg";
import CreditGray from "@/components/icon/svg/credit-gray.svg";
import CreditWhite from "@/components/icon/svg/credit-white.svg";

const SvgWrapper = (SvgComponent) => {
  const MemoizedSvgComponent = React.memo(
    ({ size = 24, fill = "#585858", ...props }) => {
      return <SvgComponent {...props} fill={fill} />;
    }
  );

  MemoizedSvgComponent.displayName = `MemoizedSvg(${
    SvgComponent.displayName || SvgComponent.name || "Component"
  })`;

  return MemoizedSvgComponent;
};

export const IconHome = SvgWrapper(Home);
export const IconCollections = SvgWrapper(Collections);
export const IconAnswers = SvgWrapper(Answers);
export const IconSettings = SvgWrapper(Settings);
export const IconExternalLink = SvgWrapper(ExternalLink);
export const IconCheckFilled = SvgWrapper(CheckFilled);
export const IconLogoWithName = SvgWrapper(LogoWithName);
export const IconGoogleLogo = SvgWrapper(GoogleLogo);
export const IconCreditGray = SvgWrapper(CreditGray);
export const IconCreditWhite = SvgWrapper(CreditWhite);
