import styled, { keyframes } from "styled-components";

const pulsIn = (color) => keyframes`
  0% {
    box-shadow: inset 0 0 0 1rem ${color};
    opacity: 1;
  }
  50%, 100% {
    box-shadow: inset 0 0 0 0 ${color};
    opacity: 0;
  }
`;

const pulsOut = (color) => keyframes`
  0%, 50% {
    box-shadow: 0 0 0 0 ${color};
    opacity: 0;
  }
  100% {
    box-shadow: 0 0 0 1rem ${color};
    opacity: 1;
  }
`;

const LoaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 6rem;
  margin-top: 3rem;
  margin-bottom: 3rem;

  &:before,
  &:after {
    content: "";
    position: absolute;
    border-radius: 50%;
    animation: ${({ color }) => pulsOut(color)} 1.8s ease-in-out infinite;
  }

  &:before {
    width: 100%;
    padding-bottom: 100%;
    box-shadow: inset 0 0 0 1rem ${({ color }) => color};
    animation-name: ${({ color }) => pulsIn(color)};
  }

  &:after {
    width: calc(100% - 2rem);
    padding-bottom: calc(100% - 2rem);
    box-shadow: 0 0 0 0 ${({ color }) => color};
  }
`;

const Loader = ({ color = "#dededf", text = "Loading" }) => (
  <div className="text-sm text-gray-500 font-medium flex flex-col justify-center items-center gap-6">
    <LoaderWrapper color={color} />
    <div>{text}</div>
  </div>
);

export default Loader;
