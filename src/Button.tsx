import { forwardRef } from "react";
import styled from "styled-components";

type Props = {
    className?: string
    text: string
    selected?: boolean
    onClick: () => void
}

const Button = forwardRef(function Button(props: Props, ref: React.Ref<HTMLButtonElement>) {
    if(props.selected !== undefined && props.selected === true)
        return <SSelectedButton ref={ref} className={props.className} onClick={_ => props.onClick()}>{props.text}</SSelectedButton>
    
    return <SButton ref={ref} className={props.className} onClick={_ => props.onClick()}>{props.text}</SButton>
});

export default Button

const SButton = styled.button`
  border-radius: 2px;
  border-style: solid;
  border-width: 3px;
  border-color: #616161;
  padding: 2px 8px;
`;

const SSelectedButton = styled(SButton)`
  color: white;
  background-color: darkgray;
`