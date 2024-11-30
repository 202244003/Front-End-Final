import React, { Component } from "react";
import "./index.css";

class GradeManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gradeData: { 1: [], 2: [], 3: [] },   // 각 학년별 데이터
      currentGrade: 1,                      // 선택된 학년 (기본값 1학년)
      tempCourses: [],                      // 선택된 학년에 입력된 데이터
      totalsCalculated: false,              // 총점 계산 필요 확인
    };
    this.grades = [1, 2, 3];                // 학년 선택 (1학년, 2학년, 3학년)
    this.majorTypes = ["전공", "교양"];      // 이수 구분 (전공, 교양)
    this.requireTypes = ["필수", "선택"];    // 필수 구분 (필수, 선택)
  }

  // 과목 추가
  addCourse = () => {
    const newCourse = {
      major: "", // 교양/전공
      require: "", // 필수/선택
      name: "", // 과목명
      credit: 1, // 학점
      attendance: 0, // 출석 점수
      task: 0, // 과제 점수
      midterm: 0, // 중간고사 점수
      final: 0, // 기말고사 점수
      total: 0, // 총점
      score: "", // 성적
      checked: false, // 체크박스 선택 여부
    };
    // 새로운 과목 추가
    this.setState((prevState) => ({
      tempCourses: [...prevState.tempCourses, newCourse], // 기존 리스트에 추가
      totalsCalculated: false, // 총점 다시 계산 필요
    }));
  };

  // 선택된 과목 삭제
  deleteCourses = () => {
    this.setState((prevState) => ({
      tempCourses: prevState.tempCourses.filter((course) => !course.checked), // 체크된 과목만 삭제
      totalsCalculated: false, // 총점 다시 계산 필요
    }));
  };

  // 입력값 제한
  validateAndAdjustInput = (value, min, max) => {
    if (value < min) return min; // 최소값보다 작은 경우
    if (value > max) return max; // 최대값보다 큰 경우
    return value; // 정상 범위
  };

  // 과목 정보 수정 
  updateCourse = (index, field, value) => {
    const updatedCourses = [...this.state.tempCourses]; // 현재 과목 리스트 복사
    // 입력값 제한
    if (["attendance", "task"].includes(field)) {
      value = this.validateAndAdjustInput(value, 0, 20); // 출석/과제 점수는 0~20 사이
    } else if (["midterm", "final"].includes(field)) {
      value = this.validateAndAdjustInput(value, 0, 30); // 중간/기말 점수는 0~30 사이
    } else if (field === "total") {
      value = this.validateAndAdjustInput(value, 0, 100); // 총점은 0~100 사이
    } else if (field === "credit") {
      value = this.validateAndAdjustInput(value, 1, 4); // 학점은 1~4 사이
    }

    updatedCourses[index][field] = value; // 해당 과목의 값 업데이트
    this.setState({ tempCourses: updatedCourses, totalsCalculated: false }); // state 업데이트
  };

  // 과목 정보 저장 및 중복 확인
saveGrades = () => {
  const { gradeData, currentGrade, tempCourses } = this.state;

  // 다른 학년 데이터 가져오기
  const otherGrades = Object.keys(gradeData)
    .filter((grade) => Number(grade) !== currentGrade) // 현재 학년을 제외한 학년들
    .reduce((acc, grade) => acc.concat(gradeData[grade]), []); // 해당 학년들의 과목 합치기

  // 다른 학년에 동일한 과목명이 존재하는지 체크 (F 학점 제외)
  const duplicateInOtherGrades = tempCourses.some((newCourse) =>
    otherGrades.some(
      (existingCourse) =>
        existingCourse.name === newCourse.name &&
        existingCourse.score !== "F" && // F 학점은 제외
        newCourse.score !== "F" // F 학점은 제외
    )
  );

  if (duplicateInOtherGrades) {
    alert("다른 학년에 동일한 과목이 이미 저장되어 있습니다. (F 학점 제외)");
    return; // 중복 과목이 있으면 저장하지 않음
  }

  // 현재 학년에 동일한 과목명이 존재하는지 체크 (F 학점 제외)
  const duplicateInCurrentGrade = tempCourses.some((newCourse, index) =>
    tempCourses.slice(0, index).some(
      (otherCourse) =>
        otherCourse.name === newCourse.name &&
        otherCourse.score !== "F" && // F 학점은 제외
        newCourse.score !== "F" // F 학점은 제외
    )
  );

  if (duplicateInCurrentGrade) {
    alert("현재 학년에 동일한 과목명이 입력되었습니다. (F 학점 제외)");
    return; // 중복 과목이 있으면 저장하지 않음
  }

  // 합계 및 학점 계산
  const updatedCourses = tempCourses.map((course) => {
    const total =
      Number(course.attendance) +
      Number(course.task) +
      Number(course.midterm) +
      Number(course.final); // 총점 계산

    // 학점 계산
    const score =
      course.credit === 1
        ? total >= 60
          ? "P" // 60점 이상: P (Pass)
          : "NP" // 60점 미만: NP (Not Pass)
        : total >= 95
        ? "A+" // 95점 이상: A+
        : total >= 90
        ? "A0" // 90점 이상: A0
        : total >= 85
        ? "B+" // 85점 이상: B+
        : total >= 80
        ? "B0" // 80점 이상: B0
        : total >= 75
        ? "C+" // 75점 이상: C+
        : total >= 70
        ? "C0" // 70점 이상: C0
        : total >= 65
        ? "D+" // 65점 이상: D+
        : total >= 60
        ? "D0" // 60점 이상: D0
        : "F"; // 60점 미만: F

    return { ...course, total, score }; // 과목에 합계, 학점 추가
  });

  // 과목 정렬 (이수, 필수, 과목명 순으로 오름차순 정렬)
  const sortedCourses = updatedCourses.sort((a, b) => {
    // 전공->교양 순으로 정렬
    if (a.major !== b.major) return b.major.localeCompare(a.major);
    // 필수->선택 순으로 정렬
    if (a.require !== b.require) return a.require.localeCompare(b.require);
    // 과목명 순으로 정렬
    return a.name.localeCompare(b.name);
  });

  // 학년 데이터 업데이트
  this.setState((prevState) => ({
    gradeData: {
      ...prevState.gradeData,
      [currentGrade]: sortedCourses, // 현재 학년 과목 업데이트
    },
    tempCourses: sortedCourses, // 화면에 표시되는 과목 업데이트
    totalsCalculated: true, // 총점 계산 완료
  }));
};
  
  // 총점 계산 함수
  calculateTotals = () => {
    const { tempCourses, totalsCalculated } = this.state;
    if (!totalsCalculated) return {}; // 총점 계산이 안 된 경우 빈 칸

    // 과목 개수와 총점 계산
    const subjectCount = tempCourses.length;
    const totalScores = tempCourses.reduce(
      (sum, course) => sum + course.total,
      0
    );
    return {
      credit: tempCourses.reduce((sum, course) => sum + course.credit, 0), // 총 학점
      attendance: tempCourses.reduce((sum, course) => sum + course.attendance, 0), // 총 출석점수
      task: tempCourses.reduce((sum, course) => sum + course.task, 0), // 총 과제점수
      midterm: tempCourses.reduce((sum, course) => sum + course.midterm, 0), // 총 중간고사 점수
      final: tempCourses.reduce((sum, course) => sum + course.final, 0), // 총 기말고사 점수
      total: tempCourses.reduce((sum, course) => sum + course.total, 0), // 총점
      average: subjectCount > 0 ? (totalScores / subjectCount).toFixed(2) : 0, // 평균
    };
  };

  render() {
    const { tempCourses, currentGrade } = this.state;
    const totals = this.calculateTotals();
  
    return (
      <div className="grade-management">
        <h1>Front-end 과제</h1>
        
        <div className="header">
          {/* 학년 선택 박스 */}
          <div className="grade-select">
            <select
              value={currentGrade}
              onChange={(e) =>
                this.setState({
                  currentGrade: Number(e.target.value),
                  tempCourses: [...this.state.gradeData[Number(e.target.value)]], // 현재 학년 데이터만 불러오기
                  totalsCalculated: false,
                })
              }
            >
              {this.grades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}학년
                </option>
              ))}
            </select>
          </div>
          
          {/* 버튼 */}
          <div className="button-group">
            <button onClick={this.addCourse}>추가</button>
            <button onClick={this.deleteCourses}>삭제</button>
            <button onClick={this.saveGrades}>저장</button>
          </div>
        </div>
  
        <table className="table">
          <thead>
            <tr>
              <th>선택</th>
              <th>이수</th>
              <th>필수</th>
              <th>과목명</th>
              <th>학점</th>
              <th>출석점수</th>
              <th>과제점수</th>
              <th>중간고사</th>
              <th>기말고사</th>
              <th>총점</th>
              <th>평균</th>
              <th>성적</th>
            </tr>
          </thead>
          <tbody>
            {tempCourses.map((course, index) => (
              <tr key={index} style={{ color: course.score === "F" ? "red" : "black" }}>
                <td>
                  <input
                    type="checkbox"
                    checked={course.checked}
                    onChange={() => {
                      const updatedCourses = [...tempCourses];
                      updatedCourses[index].checked = !updatedCourses[index].checked;
                      this.setState({ tempCourses: updatedCourses });
                    }}
                  />
                </td>
                <td>
                  <select
                    value={course.major}
                    onChange={(e) => this.updateCourse(index, "major", e.target.value)}
                  >
                    <option value="" disabled>
                      이수 구분
                    </option>
                    {this.majorTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={course.require}
                    onChange={(e) => this.updateCourse(index, "require", e.target.value)}
                  >
                    <option value="" disabled>
                      필수 구분
                    </option>
                    {this.requireTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="text"
                    value={course.name}
                    onChange={(e) => this.updateCourse(index, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.credit}
                    onChange={(e) =>
                      this.updateCourse(index, "credit", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.attendance}
                    onChange={(e) =>
                      this.updateCourse(index, "attendance", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.task}
                    onChange={(e) =>
                      this.updateCourse(index, "task", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.midterm}
                    onChange={(e) =>
                      this.updateCourse(index, "midterm", Number(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={course.final}
                    onChange={(e) =>
                      this.updateCourse(index, "final", Number(e.target.value))
                    }
                  />
                </td>
                <td>{course.total}</td>
                <td></td>
                <td>{course.score}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="4">합계</td>
              <td>{totals.credit}</td>
              <td>{totals.attendance}</td>
              <td>{totals.task}</td>
              <td>{totals.midterm}</td>
              <td>{totals.final}</td>
              <td>{totals.total}</td>
              <td>{totals.average}</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}  

export default GradeManagement; 