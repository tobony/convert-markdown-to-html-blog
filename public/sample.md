
# Sample - Google Firebase 활용

## Firebase Genkit과 Ollama 연동 방법

**Firebase Genkit**과 **Ollama**는 플러그인 방식을 통해 쉽게 연동할 수 있습니다. Ollama는 로컬에서 다양한 오픈소스 LLM(대형 언어 모델)을 실행할 수 있는 서버이며, Genkit은 이 Ollama 서버에 직접 연결하여 AI 기능을 활용할 수 있게 해줍니다.


6. **Genkit 개발자 UI 및 워크플로우 테스트**
   - `genkit start` 명령어로 Genkit UI를 실행하고, 브라우저에서 워크플로우를 테스트할 수 있습니다.
   - 기본 주소: `http://localhost:4000`
     [1][3][5]

이 과정을 통해 Firebase Genkit과 Ollama를 연동하여, 로컬 또는 서버 환경에서 다양한 AI 모델을 활용한 앱을 빠르게 개발할 수 있습니다[1][2][4][5].

<!-- MORE -->
Citations:
[1] https://firebase.google.com/docs/genkit-go/plugins/ollama
[2] https://firebase.google.com/docs/genkit/plugins/ollama
[3] https://github.com/xavidop/firebase-genkit-ollama
[4] https://ollama.com/blog/firebase-genkit
<!-- MORE -->


---

# 마크다운 샘플 파일

이 파일은 애플리케이션이 처음 실행될 때 로드되는 샘플 마크다운 파일입니다.

## 기능 사용법

1. 왼쪽 패널에 마크다운을 입력하세요
2. 오른쪽 패널에서 HTML 결과를 확인하세요
3. 필요한 경우 사용자 정의 CSS를 추가할 수 있습니다

## 마크다운 예시

**굵은 텍스트**와 *기울임꼴 텍스트*를 사용할 수 있습니다.

### 코드 블록

```javascript
function hello() {
  console.log("안녕하세요!");
}
```

### 표

| 항목 | 설명 |
|------|------|
| 항목 1 | 설명 1 |
| 항목 2 | 설명 2 |

### 인용문

> 이것은 인용문입니다.
> 여러 줄로 작성할 수 있습니다.


# h1 Heading
## h2 Heading
### h3 Heading
#### h4 Heading


## Horizontal Rules
___

---

***

## Emphasis

**This is bold text**

__This is bold text__

*This is italic text*

_This is italic text_

~~Strikethrough~~


## Blockquotes

> Blockquotes can also be nested...
>> ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.


## Lists
Unordered
+ Create Excel lists by starting with functions like `SUM`, `AVERAGE`, or `COUNT`
+ Advanced functions are categorized by type:
  - Mathematical functions for calculations:
    * SUM to add values in a range
    + AVERAGE to find the mean of values
    - MAX and MIN to find highest and lowest values
+ Excel makes data analysis easy!

Ordered

1. Calculate sum of a cell range using the SUM function
2. Find data from another table using the VLOOKUP function
3. Perform conditional calculations using the IF function


1. Use sequential numbering or...
1. ...keep all numbers as `1.`

Start from a specific number:

57. Combine text using the CONCATENATE function
1. Calculate average values using the AVERAGE function


## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code


Block code "fences"
```
Sample text here...
```

Syntax highlighting
``` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

``` py
import pandas as pd
print("hello")

```


## Tables

| Excel Function | Description |
| -------------- | ----------- |
| EVALUATE       | Evaluates a formula or expression and returns the result. |
| TEXTJOIN       | Combines text from multiple ranges or strings, using a delimiter. |
| FILTER         | Filters a range of data based on criteria you define. |

Right aligned columns

| Excel Function | Description |
| --------------:| -----------:|
| EVALUATE       | Evaluates a formula or expression and returns the result. |
| TEXTJOIN       | Combines text from multiple ranges or strings, using a delimiter. |
| FILTER         | Filters a range of data based on criteria you define. |


## Links

[link text](https://tobony.blogspot.com/)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Autoconverted link https://github.com/nodeca/pica (enable linkify to see)


## Images

![ImgSample1](https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgwkSBxOD8Adwmzod0SisrbXrX2WgEFmCO40me1qnRi4IX9M3ZpXw4pMoNPGL-ttnTmrE3Flu1x9HBrZDaPmHQaoyn_YgokCo9M2H9z4Rffqrqd6bDpiJL173vUV068-5KtacUzPQlaL3_oSHl7hEqkuHeGzS0l-3-UsimL_3hKgYb53-dGR20MydjLWf6W/s219/defaultCodeRedhtml.png)

![ImgSample2](https://blogger.googleusercontent.com/img/a/AVvXsEidN8Ddfpej_AhvkC7wFFgWea8Z68TEk1pfM1-8cc6ku0Amg9Q8JT5qJHcX84BQv77lTa6ULVa-CaI7w5JuVHXkUWiUqlQyyPtAvN9FeCBZkNvW14LAa3gRaROrA0UG-1OS0rLx1VeH0Ps9y3nc8veR93ySzebEYqetSVapti6VmyCMC2r8Fs-IQ8GFGpDb=s150"The Stormtroopocat")

<br/>

Like links, Images also have a footnote style syntax

![Alt text][id]

With a reference later in the document defining the URL location:

[id]: https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXcw9EVsBjnpp4MM8DdH1SJ9gekpLQCulQxeL1-ABVFOjC3xDlXHjYMz4fLOZR31NHf4iCMZVejW2FDeNjVDjgzFv1DqKVoU5Iy063SxpkdnoSO8WHmWa6Iuvk7PLgMKf9-EWx6ZCj4Slf7bH14wlohjcXst2csRZudS9Y60n-uwPn68I2GOoqDdZRO5A9/w362-h330-p-k-no-nu/defaultCodeBlack.png=w72-h72-p-k-no-nu  "ImgSample2"


<br/><br/><br/>

