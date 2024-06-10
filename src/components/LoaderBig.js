import styled, { keyframes } from "styled-components";

const rotate = keyframes`
0% {  transform: rotate(0)}
100% { transform: rotate(360deg)}
`;

const LoaderWrapper = styled.div`
  position: relative;
  width: 64px;
  height: 64px;

  &:after,
  &:before {
    content: "";
    border-radius: 50%;
    position: absolute;
    inset: 0;
    box-shadow: 0 0 12px 12px rgba(112, 244, 236, 0.07) inset;
  }

  &:after {
    box-shadow: 0 2px 0 ${(props) => props.color || "#12EDE0"} inset;
    animation: ${rotate} 3s linear infinite;
  }
`;

const Loader = ({ text = "", title = "Loading", color }) => (
  <div className="text-sm flex flex-col justify-center items-center gap-6 text-center p-10 py-20 rounded-3xl">
    <LoaderWrapper color={color} />
    <div className="flex flex-col gap-2">
      <p className="font-medium">{title}</p>
      <p className="max-w-[480px] text-gray-600">{text}</p>
    </div>
  </div>
);

export default Loader;
