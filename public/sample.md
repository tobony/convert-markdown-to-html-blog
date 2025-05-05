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

---

즐거운 마크다운 변환 되세요!

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

+ Create a list by starting a line with `+`, `-`, or `*`
+ Sub-lists are made by indenting 2 spaces:
  - Marker character change forces new list start:
    * Ac tristique libero volutpat at
    + Facilisis in pretium nisl aliquet
    - Nulla volutpat aliquam velit
+ Very easy!

Ordered

1. Lorem ipsum dolor sit amet
2. Consectetur adipiscing elit
3. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as `1.`

Start numbering with offset:

57. foo
1. bar


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

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ------:| -----------:|
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |


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
