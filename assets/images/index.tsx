import * as React from "react"
import Svg, { Path } from "react-native-svg"

function IconChargingLocation(props: any) {
    return (
      <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={70}
        height={50}
        viewBox="0 0 500 500"
        {...props}
      >
        <Path
          d="M2398 4840c-320-40-655-193-913-417-254-219-436-538-495-865-58-320-39-648 55-978 192-672 670-1306 1330-1763 116-81 144-96 176-97 16 0 64 24 120 61 493 321 889 790 1136 1344 271 605 316 1266 123 1770-83 214-240 436-412 583-219 185-432 290-707 347-90 19-320 27-413 15zm307-365c148-27 224-53 362-124 491-254 747-825 613-1364-119-474-508-829-995-907-113-18-297-14-413 10-479 97-836 442-953 920-20 81-23 121-23 270 0 200 16 291 86 460 156 383 500 661 910 735 100 18 315 18 413 0z"
          fill={'#0A7EA4'}
          transform="matrix(.1 0 0 -.1 0 499)"
        />
        <Path
          d="M2205 3946c-57-25-60-34-63-223l-4-173h-113c-111 0-114-1-134-26-15-19-21-41-21-79 0-68 20-94 78-102l42-6v-86c1-152 38-269 107-338 68-68 138-99 286-128l27-5v-180h199l3 92 3 91 69 14c99 20 153 49 221 118 80 79 103 139 118 303 10 108 13 122 30 122 21 0 59 18 69 34 4 6 8 41 8 78 0 91-10 98-151 98h-107l-4 173c-3 191-6 199-66 224-40 17-88 5-118-28-17-19-19-42-22-195l-4-174h-308l-1 158c-1 86-4 168-8 181-13 49-85 79-136 57z"
          fill={'#0A7EA4'}
          transform="matrix(.1 0 0 -.1 0 499)"
        />
      </Svg>
    )
  }
export default IconChargingLocation