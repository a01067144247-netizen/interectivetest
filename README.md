# interectivetest

브라우저에서 **마우스로 그리는** 단순 그림판(MVP)입니다. 빌드 도구 없이 정적 파일만으로 동작합니다.

## 기능

- 색 8종, 굵기 슬라이더
- 펜 / 지우개(`destination-out`)
- 전체 지우기(흰 배경으로 초기화)
- **PNG 저장**

## 실행 방법

### 1) VS Code Live Server

`index.html`을 연 뒤 Live Server로 열기.

### 2) Python (내장 HTTP 서버)

```powershell
cd c:\Users\a0106\Desktop\interectivetest
py -m http.server 8080
```

브라우저에서 `http://localhost:8080` 접속.

### 3) npx (Node 설치된 경우)

```powershell
cd c:\Users\a0106\Desktop\interectivetest
npx --yes serve .
```

## 파일

| 파일        | 설명        |
| ----------- | ----------- |
| `index.html` | UI 뼈대   |
| `styles.css` | 레이아웃·툴바 |
| `draw.js`    | 캔버스 그리기 로직 |

## Git

```powershell
git status
```
