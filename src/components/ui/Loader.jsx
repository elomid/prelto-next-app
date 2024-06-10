import styles from "./Loader.module.css";

export default function Loader({
  size = 16,
  borderWidth = 2,
  trackColor = "#dededf",
  spinnerColor = "#000",
  speed = "1s",
}) {
  return (
    <div
      className={styles.loader}
      style={{
        width: size,
        height: size,
        borderWidth: borderWidth,
        borderColor: trackColor,
        borderBottomColor: spinnerColor,
        animationDuration: speed,
      }}
    ></div>
  );
}
