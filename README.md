# Front-End 과제

202244003 윤예빈

## 프로젝트 소개

### 개발 환경
<img src="https://img.shields.io/badge/react-%2361DAFB.svg?&style=for-the-badge&logo=react&logoColor=black" />

### 프로젝트 설명
한 학기동안 배운 내용을 바탕으로 Final 과제 학점 관리 시스템 개발

<table>
  <tr>
    <td>선택</td>
    <td>이수</td>
    <td>필수</td>
    <td>과목명</td>
    <td>학점</td>
    <td>출석점수</td>
    <td>과제점수</td>
    <td>중간고사</td>
    <td>기말고사</td>
    <td>총점</td>
    <td>평균</td>
    <td>성적</td>
  </tr>
  <tr>
    <td>□</td>
    <td>전공/교양</td>
    <td>필수/선택</td>
    <td></td>
    <td>1~4</td>
    <td>0~20</td>
    <td>0~20</td>
    <td>0~30</td>
    <td>0~30</td>
    <td>0~100</td>
    <td></td>
    <td>A+</td>
  </tr>
  <tr>
    <td colSpan="4">합계</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td>0</td>
    <td></td>
    </tr>
</table>


### 주요 내용
- 학년별 과목 추가, 삭제
- 과목별 총점, 학점 계산
- 합계열 계산
- 과목명 중복 방지
- 점수 입력값 제한
- 이수, 필수, 과목명 순 오름차순 정렬 등

### 파일 구조
```
/front-end-final/
│
├──public/
│  └──index.html
│
└──src/
   ├──GradeManagement.js
   ├──index.js
   └──index.css

```


### 결과

[실행 화면](https://front-end-final-ten.vercel.app/, "실행 화면")
