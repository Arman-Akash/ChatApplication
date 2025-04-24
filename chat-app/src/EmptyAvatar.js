const colors = [
    "#87CEEB", // Sky Blue
    "#D8BFD8", // Thistle
    "#98FB98", // Pale Green
    "#FFDAB9", // Peach Puff (kept from earlier, it's just right!)
    "#FF69B4", // Hot Pink (a bit bolder, still soft)
    "#E0FFFF", // Light Cyan
    "#FFFACD", // Lemon Chiffon (also stays — soft but not faded)
    "#AFEEEE"  // Pale Turquoise
  ];

const EmptyAvatar = ({name}) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const style = {
        circle: {
            borderRadius: '50%',
            backgroundColor: randomColor,
            height: '46px',
            width: '46px',
            marginLeft: '20px'
        },
        initial:{
            margin: 'auto',
            fontSize: '28px',
            color: '#555555',
            paddingLeft: '15px',
            fontWeight: '600'
        }
    }
    return (
        <div style={style.circle}>
            <span style={style.initial}>{name[0].toUpperCase()}</span>
        </div>
    )
}

export default EmptyAvatar;