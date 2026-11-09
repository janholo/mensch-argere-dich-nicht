import styled from "styled-components";
import { Field, GameState } from "./game-logic/model";

const playerColors = [
    "#ef476f",
    "#ffd166",
    "#06d6a0",
    "#118ab2"
]

type Props = {
    gameState: GameState;
    className?: string
}

const fields = GetFields();

const normalFields = fields.slice(0, 40)
const bases = fields.slice(40, 56)
const endFields = fields.slice(56, 72)

const normalFieldPoints = normalFields.reduce((prev: string, f: Field) => prev + (f.x*10) + "," + (f.y*10) + " ", "")

function Board(props: Props) {
    const player0 = props.gameState.players.find(p => p.number == 0);
    const player1 = props.gameState.players.find(p => p.number == 1);
    const player2 = props.gameState.players.find(p => p.number == 2);
    const player3 = props.gameState.players.find(p => p.number == 3);

    const allPiecesNested = props.gameState.players.map(p => p.pieces.map(piece => { return { piece: piece, number: p.number }}))
    const allPieces = allPiecesNested.reduce((l, agg) => agg.concat(l), []);

    const dashArray = "0.8 0.5"
    const strokeWidth = "0.4"

    return (
    <Border className={props.className}>
        <DrawArea viewBox="-10 -10 120 120" >
            {player0 && <text x="-7.5" y="-5" fontSize="4">{player0.name}</text>}
            {player1 && <text x="107.5" y="-5" fontSize="4" style={{"textAnchor": "end"}}>{player1.name}</text>}
            {player2 && <text x="107.5" y="108" fontSize="4" style={{"textAnchor": "end"}}>{player2.name}</text>}
            {player3 && <text x="-7.5" y="108" fontSize="4">{player3.name}</text>}
            <polygon points={normalFieldPoints} fill="none" stroke="black" strokeWidth="0.4" />
            {bases.map(b => <circle key={b.fieldNumber} cx={b.x * 10} cy={b.y * 10} r="2.5" stroke={playerColors[b.baseOfPlayer!]} strokeDasharray={dashArray} strokeWidth={strokeWidth} fill="white" />)}
            {endFields.map(b => <circle key={b.fieldNumber} cx={b.x * 10} cy={b.y * 10} r="2.5" stroke={playerColors[b.endFieldOfPlayer!]} strokeDasharray={dashArray} strokeWidth={strokeWidth} fill="white" />)}
            {normalFields.map(b => <circle key={b.fieldNumber} cx={b.x * 10} cy={b.y * 10} r="3" stroke={b.startFieldOfPlayer !== undefined ? playerColors[b.startFieldOfPlayer] : "black"} strokeDasharray={dashArray} strokeWidth={strokeWidth} fill="white" />)}
            {allPieces.map((p, i) => {
                const f = fields[p.piece];
                return <circle key={"p-"  + i} cx={f.x * 10} cy={f.y * 10} r="3.5" stroke="black" strokeWidth={strokeWidth} fill={playerColors[p.number]} />
            })}
            {bases.map(b => <text key={"t" + b.fieldNumber} x={b.x * 10} y={b.y * 10} fill="#777777" fontSize="2" dominantBaseline="middle" textAnchor="middle" >{b.fieldNumber}</text>)}
            {endFields.map(b => <text key={"t" + b.fieldNumber} x={b.x * 10} y={b.y * 10} fill="#777777" fontSize="2" dominantBaseline="middle" textAnchor="middle" >{b.fieldNumber}</text>)}
            {normalFields.map(b => <text key={"t" + b.fieldNumber} x={b.x * 10} y={b.y * 10} fill="#777777" fontSize="2" dominantBaseline="middle" textAnchor="middle" >{b.fieldNumber}</text>)}
        </DrawArea>
    </Border>)
}

const DrawArea = styled.svg`
    background-color: white;
`

const Border = styled.div`
  border-style: solid;
  border-color: black;
  border-width: 3px;
  filter: drop-shadow(black 3px 3px 10px);
`;

function GetFields(): Field[]
{
    var allFields = [
        ...GetBase(0, 0, 0),
        ...GetBase(1, 9, 0),
        ...GetBase(2, 9, 9),
        ...GetBase(3, 0, 9),
        ...GetEndFields(0, 1, 5, 1, 0),
        ...GetEndFields(1, 5, 1, 0, 1),
        ...GetEndFields(2, 9, 5, -1, 0),
        ...GetEndFields(3, 5, 9, 0, -1),
        
        ...GetNormalFields(),
    ]

    return allFields.sort((n1,n2) => {
        if (n1.fieldNumber > n2.fieldNumber) {
            return 1;
        }
    
        if (n1.fieldNumber < n2.fieldNumber) {
            return -1;
        }
    
        return 0;
    });
}

function GetBase(player: number, x: number, y: number) : Field[]
{
    let f = []
    for(let dx = 0; dx < 2; dx++) 
    {
        for(let dy = 0; dy < 2; dy++)
        {
            f.push({
                fieldNumber: 40 + (player)*4 + dx*2 + dy,
                x: x + dx,
                y: y + dy,
                baseOfPlayer: player
            })
        }
    }

    return f;
}

function GetEndFields(player: number, x: number, y: number, dx: number, dy: number) : Field[]
{
    let f = []
    for(let i = 0; i < 4; i++) 
    {
        f.push({
            fieldNumber: 40 + 16 + (player)*4 + i,
            x: x + dx * i,
            y: y + dy * i,
            endFieldOfPlayer: player
        })
    }

    return f;
}

function GetNormalFields()
{
    let f = []
    let x = 0
    let y = 4
    let dx = 0;
    let dy = -1;
    for(let i = 0; i < 40; i++)
    {
        f.push({
            fieldNumber: i,
            x: x,
            y: y,
            startFieldOfPlayer: (i % 10 == 0) ? i / 10 : undefined
        })

        let xNew = dx;
        let yNew = dy;

        const rest = i % 10;

        if(rest == 4)
        {
            // Turn left
            xNew = dy;
            yNew = -dx;
        }

        if(rest == 8 || rest == 0)
        {
            // Turn right
            xNew = -dy;
            yNew = dx;
        }

        dx = xNew;
        dy = yNew;
        x += dx;
        y += dy;
    }

    return f;
}

export default Board
