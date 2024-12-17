import styled from "styled-components";

type Props = {
   className?: string
   text: string
   onClick: () => void
}

function Button(props: Props) {
    return <SButton className={props.className} onClick={_ => props.onClick()}>{props.text}</SButton>
}

export default Button

const SButton = styled.button`
  border-radius: 2px;
  border-style: solid;
  border-width: 3px;
  border-color: #616161;
  padding: 2px 8px;
`;