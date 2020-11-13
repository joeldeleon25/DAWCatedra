// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyD8yflzV-huKgI2gub0piZldCW7cb6j8r0",
  authDomain: "puzzle-daw.firebaseapp.com",
  databaseURL: "https://puzzle-daw.firebaseio.com",
  projectId: "puzzle-daw",
  storageBucket: "puzzle-daw.appspot.com",
  messagingSenderId: "344947748273",
  appId: "1:344947748273:web:63a807b16f146c997ae190",
  measurementId: "G-CQF267BTKZ"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var storage = firebase.storage();
var storageRef = storage.ref();
$(document).ready(function () {
  $("#startCont").fadeIn(1000);
  $("#innerBox").width($("#container").innerWidth() - 30).height($("#container").innerHeight() - 30).css("margin", "15px auto");
  let picsLevel1 = [];
  let picsLevel2 = [];
  let picsLevel3 = [];
  let picsLevel4 = [];
  let picsLevel5 = [];
  
  storageRef.child('/level1').listAll().then(function (result) {
    result.items.forEach(element => {
      element.getDownloadURL().then(image => {
        let img = new Image();
        img.src = image;
        picsLevel1.push(img);
      });
    });
  });
  storageRef.child('/level2').listAll().then(function (result) {
    result.items.forEach(element => {
      element.getDownloadURL().then(image => {
        let img = new Image();
        img.src = image;
        picsLevel2.push(img);
      });
    });
  });
  storageRef.child('/level3').listAll().then(function (result) {
    result.items.forEach(element => {
      element.getDownloadURL().then(image => {
        let img = new Image();
        img.src = image;
        picsLevel3.push(img);
      });
    });
  });
  storageRef.child('/level4').listAll().then(function (result) {
    result.items.forEach(element => {
      element.getDownloadURL().then(image => {
        let img = new Image();
        img.src = image;
        picsLevel4.push(img);
      });
    });
  });
  storageRef.child('/level5').listAll().then(function (result) {
    result.items.forEach(element => {
      element.getDownloadURL().then(image => {
        let img = new Image();
        img.src = image;
        picsLevel5.push(img);
      });
    });
  });
  var pics = [picsLevel1, picsLevel2, picsLevel3, picsLevel4, picsLevel5];
  var level = 1;
  var imgPos = 0;
  var limit, n, arrLast;
  var moves, arrSize, idX, arr, orig, current;
  var canv, W, H, c;
  arrSize = [3, 4, 5, 6, 7];
  var sS, sD, Xs, Ys;
  var tmoves = 0;
  var perLevel = [];

  function getImages(ref) {

  }

  function matrix() {
    var b = $("#box");
    b.html("");
    b.append('<canvas id="canv"> </canvas>');
    canv = $("#canv");
    W = 300;
    H = 300;
    canv[0].width = W;
    canv[0].height = H;
    c = canv[0].getContext("2d");
    orig = [];
    current = [];
    arr = [];
    idX = 1;
    moves = 0;

    n = level - 1;
    sD = W / arrSize[n];
    sS = sD;
    limit = sD;
    arrLast = arrSize[n] * arrSize[n];

    //creating the table
    var table1 = $('<table border="0" class="table1"></table>');
    for (var i1 = 0; i1 < arrSize[n]; i1++) {
      var row = $('<tr> </tr>');
      for (var j1 = 0; j1 < arrSize[n]; j1++) {
        row.append('<td class="shit">' + idX + '</td>');
        idX++;
      }
      table1.append(row);
    }
    b.append(table1);

    c.fillStyle = "rgba(0,255,255,0.4)";
    c.fillRect(0, 0, W, H);
    $("td").css({
      "width": (sD - 6) + "px",
      "height": (sD - 6) + "px"
    });

    // creating the matrix
    var temp = [];
    var temp2 = [];
    idX = 1;
    for (var i2 = 0; i2 < arrSize[n]; i2++) {
      for (var j2 = 0; j2 < arrSize[n]; j2++) {
        temp.push({
          idX: idX,
          sX: j2 * sS,
          sY: i2 * sS,
          dX: j2 * sD,
          dY: i2 * sD
        });
        temp2.push(idX);
        idX++;
      }
      arr.push(temp);
      temp = [];
      orig.push(temp2);
      current.push(temp2);
      temp2 = [];
    }
    // join orig
    orig = orig.join("");

  } // end of matrix function

  //drawing
  function drawIt(fixed, moving) {
    c.lineWidth = "2";
    c.drawImage(pics[n][imgPos], fixed.sX, fixed.sY, sD, sD, fixed.dX, fixed.dY, sD, sD);
    c.fillStyle = "rgba(0,0,0,0.5)";
    c.fillRect(fixed.dX, fixed.dY, sD, sD);

    for (var i3 = 0; i3 < arrSize[n]; i3++) {
      for (var j3 = 0; j3 < arrSize[n]; j3++) {
        var r = arr[i3][j3];
        if (fixed.idX == r.idX || moving.idX == r.idX) {
          continue;
        }
        c.strokeStyle = "lime";
        c.strokeRect(r.dX, r.dY, sD, sD);
        c.drawImage(pics[n][imgPos], r.sX, r.sY, sD, sD, r.dX, r.dY, sD, sD);
      }
    } // end of loop
    c.strokeStyle = "black";
    c.strokeRect(moving.dX, moving.dY, sD, sD);
    c.drawImage(pics[n][imgPos], moving.sX, moving.sY, sD, sD, moving.dX, moving.dY, sD, sD);

  }

  Array.prototype.swap = function (ip, jp, Xp, Yp, dir) {
    var b = this[ip][jp];
    this[ip][jp] = this[ip + (Yp * dir)][jp + (Xp * dir)];
    this[ip + (Yp * dir)][jp + (Xp * dir)] = b;
    return this;
  };

  function findFixed(arrf) {
    for (var i4 = 0; i4 < arrSize[n]; i4++) {
      for (var j4 = 0; j4 < arrSize[n]; j4++) {
        if (arrf[i4][j4].idX == arrLast) {
          var findfix = arrf[i4][j4];
          return {
            findF: findfix,
            iFix: i4,
            jFix: j4,
          };
        }
      }
    }

  }

  function whichWay(val) {
    var chosenI, chosenJ;
    for (var iW = 0; iW < arrSize[n]; iW++) {
      for (var jW = 0; jW < arrSize[n]; jW++) {
        if (current[iW][jW] == $(val).text()) {
          chosenI = iW;
          chosenJ = jW;
        }
      }
    }
    if (chosenI + 1 < arrSize[n] && current[chosenI + 1][chosenJ] == arrLast) {
      Ys = 1;
      Xs = 0;
    } else if (chosenI - 1 >= 0 && current[chosenI - 1][chosenJ] == arrLast) {
      Ys = -1;
      Xs = 0;
    } else if (chosenJ + 1 < arrSize[n] && current[chosenI][chosenJ + 1] == arrLast) {
      Ys = 0;
      Xs = 1;
    } else if (chosenJ - 1 >= 0 && current[chosenI][chosenJ - 1] == arrLast) {
      Ys = 0;
      Xs = -1;
    }

  }

  function switcher(tds) {
    var fxd = findFixed(arr);
    var fixed = fxd.findF;
    whichWay(tds);
    for (var i5 = 0; i5 < arrSize[n]; i5++) {
      for (var j5 = 0; j5 < arrSize[n]; j5++) {
        if ($(tds).text() == current[i5][j5] && current[i5 + Ys][j5 + Xs] == arrLast) {
          var pos = $(tds).text();
          animateIt(fixed, pos, Xs, Ys, i5, j5, 5);
          $("tr").eq(i5 + Ys).children().eq(j5 + Xs).text($(tds).text());
          $(tds).text(arrLast);
          current.swap(i5, j5, Xs, Ys, 1);
          moves++;
          tmoves++;
          $("#moves").html("Movimientos : " + moves);
          $("#totalmoves").html("Total Movimientos : " + tmoves);
        }
      }
    }
  }

  function clear() {
    c.fillStyle = "rgba(100,100,100,1)";
    c.fillRect(0, 0, W, H);
  }

  function checkIfSolved() {
    if (orig == current.join("")) {
      return true;
    } else {
      return false;
    }
  }

  function animateIt(fixed, tda, Xa, Ya, ia, ja, fps) {
    var rr = arr[ia][ja];
    var incre = fps;
    var start = 0;

    var setInt = setInterval(function () {
      rr.dX += (incre * Xa);
      rr.dY += (incre * Ya);
      clear();
      drawIt(fixed, rr);
      start += incre;

      if (start == sD || start > sD) {
        clearInterval(setInt);
        arr.swap(ia, ja, Xa, Ya, 1);
        if (checkIfSolved()) {
          levelUp();
        }
        start = 0;
      }
    }, 1)
  }

  function levelUp() {
    level++;
    perLevel.push(moves);
    moves = 0;
    if (level > arrSize.length) {
      moves = 0;
      tmoves = 0;
      $("imgPos").css("display", "none");
      $("#fText").html(" ¡Has terminado el juego! <br> ¡Felicidades! <br> Tus resultados: <br> Nivel 1 : " + perLevel[0] + " movimientos <br> Nivel 2 : " + perLevel[1] + " movimientos <br> nivel 3 : " + perLevel[2] + " movimientos <br> nivel 4 : " + perLevel[3] + " movimientos <br> nivel 5 : " + perLevel[4] + " movimientos <br> nivel 6 : " + perLevel[5] + " movimientos <br> Total : " + eval(perLevel.join('+')) + " movimientos <br> ¡Gracias por jugar!");
      $("#finished").fadeIn(200);
      return;
    }
    $("#congratsText").html("¡Felicidades! <br> Resolviste el nivel " + (level - 1));
    $("#nextBut").html("¿Listo para el <br> nivel " + level + " ?");
    $("#nextLevel").fadeIn(500);
    $("#nextBut").on("click", function () {
      $("#nextLevel").fadeOut(200);
      $("#moves").html("Movimientos : " + moves);
      randomize();
    })
  }

  function nextImage() {
    imgPos++;
    moves = 0;
    if (imgPos >= pics[n].length) {
      imgPos = 0;
    }
    $("#congratsText").html("Cambiaste la imagen del nivel " + level);
    $("#nextBut").html("Empezarás de nuevo");
    $("#nextLevel").fadeIn(500);
    $("#nextBut").on("click", function () {
      $("#nextLevel").fadeOut(200);
      $("#moves").html("Movimientos : " + moves);
      randomize();
    })
  }

  function randomize() {
    $("#loadingText").html("Cargando nivel " + level)
    $("#loading").fadeIn(300);
    matrix();
    eventList();
    $("#level").html("Nivel " + level);
    if (level > arrSize.length) {
      $("#pic" + (level + 1)).css("display", "block");
    } else {
      $("#pic" + level).css("display", "block");
    }
    var v = 0;
    var prev = current[0][0];
    var set2 = setInterval(function () {
      if (v == 100 * level) {
        clearInterval(set2);
        $("#loading").fadeOut(500);
        if (checkIfSolved()) {
          randomize();
        }
      }
      var rand1 = Math.random();
      var rand2 = Math.round(Math.random());
      var rand3 = Math.random();
      var randX = rand2;
      var randY = 1;
      if (randX == 1) {
        randY = 0;
      }
      if (rand1 < 0.5) {
        randX = -randX;
        randY = -randY;
      }

      var rf = findFixed(arr);
      var rIfix = rf.iFix;
      var rJfix = rf.jFix;
      var rIY = rIfix - (randY);
      var rJX = rJfix - (randX);

      if (rIY <= arrSize[n] - 1 && rJX - (randX) <= arrSize[n] && rIY >= 0 && rJX >= 0) {

        if (current[rIY][rJX] != prev) {
          var curR = current[rIfix - (randY)][rJfix - (randX)];
          prev = curR;
          var arrR = arr[rIfix - (randY)][rJfix - (randX)];
          arrR.dX += (sD * randX);
          arrR.dY += (sD * randY);
          clear();
          drawIt(arr[rIfix][rJfix], arr[rIY][rJX]);

          arr.swap(rIfix, rJfix, randX, randY, -1);
          current.swap(rIfix, rJfix, randX, randY, -1);

          $("tr").eq(rIfix).children().eq(rJfix).text(current[rIfix][rJfix]);
          $("tr").eq(rIY).children().eq(rJX).text(current[rIY][rJX]);

        }
      }
      v++;
    }, 1)

    $(`#pic${level}`).attr("src", pics[n][imgPos].src);
  }
  $("#startBut").on("click", function () {
    $("#startCont").fadeOut(700);
    $("#pics").css("display", "block");
    setTimeout(randomize, 800);
  })
  // eventList();
  function eventList() {
    $("td").on("click", function (e) {
      var that = this;
      switcher(that);
    })
  }
  $("#nextLvl").on("click", levelUp);
  $("#nextImg").on("click", nextImage);
  $("#startBut").on("click", function () {
    $("#startCont").fadeOut(700);
    $("#pics").css("display", "block");
    setTimeout(randomize, 800);
  })
  $("#restartBut").on("click", function () {
    $("#finished").fadeOut(500);
    level = 1;
    setTimeout(randomize, 800);
  })
})