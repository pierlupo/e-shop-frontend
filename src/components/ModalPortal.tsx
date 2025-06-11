import {createPortal} from "react-dom";
import type {ReactNode} from "react";

const modalRoot = document.getElementById("modal-root") as HTMLElement;

const ModalPortal = ({ children }: { children: ReactNode }) => {
    return createPortal(children, modalRoot);
};

export default ModalPortal;