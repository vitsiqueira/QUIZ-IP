(function() {
  var questionCounter = 0; //Tracks question number
  var selections = []; //Array containing user choices
  var wrongs = [];
  var quiz = $('#quiz'); //Quiz div object

  // Display initial question
  displayNext();

  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
      e.preventDefault();

      // Suspend click listener during fade animation
      if(quiz.is(':animated')) {
        return false;
      }
      choose();

      // If no user selection, progress is stopped
      if (isNaN(selections[questionCounter])) {
        alert('Por favor, escolha pelo menos uma opção!');
      } else {
        showWrongOrRight();
        questionCounter++;
        setTimeout(function () {
          displayNext();
        }, 1000);

      }
  });

  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
    e.preventDefault();

    if(quiz.is(':animated')) {
      return false;
    }
    questionCounter = 0;
    selections = [];
    wrongs = [];
    displayNext();
    $('#start').hide();
  });

  // Creates and returns the div that contains the questions and
  // the answer selections
  function createQuestionElement(index) {
    var qElement = $('<div>', {
      id: 'question'
    });

    //var header = $('<h2>Question ' + (index + 1) + ':</h2>');
    // qElement.append(header);

    var numQuestion = (index+1);
    var question = $('<h3>').append(numQuestion + '. ' + questions[index].question);
    qElement.append(question);

    var radioButtons = createRadios(index);
    qElement.append(radioButtons);

    return qElement;
  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
    var radioList = $('<ul>');
    var item;
    var input = '';
    for (var i = 0; i < questions[index].choices.length; i++) {
      item = $('<li>');
      input = '<input type="radio" name="answer" value=' + i + ' />';
      input += questions[index].choices[i];
      item.append(input);
      radioList.append(item);
    }
    return radioList;
  }

  // Reads the user selection and pushes the value to an array
  function choose() {
    selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }

  function showWrongOrRight() {
    value = $('input[name="answer"]:checked').val()
    listLi = $('div#quiz li');

    if (value == questions[questionCounter].correctAnswer) {
      $(listLi[value]).addClass("green")
    }
    else {
      $(listLi[value]).addClass("red")
      wrongs.push(questionCounter);
    }
  }

  // Displays next requested element
  function displayNext() {
    quiz.fadeOut(function() {
      $('#question').remove();
      $('#question').remove();//remover onde estao os links

      if(questionCounter < questions.length){
        var nextQuestion = createQuestionElement(questionCounter);
        quiz.append(nextQuestion).fadeIn();
        if (!(isNaN(selections[questionCounter]))) {
          $('input[value='+selections[questionCounter]+']').prop('checked', true);
        }

        if(questionCounter === 0){
          $('#next').show();
        }
      }else {
        var scoreElem = displayScore();
        var answersLoc = displayLoc();
        quiz.append(scoreElem).fadeIn();
        quiz.append(answersLoc).fadeIn();
        $('#next').hide();
        $('#start').show();
      }
    });
  }

  function displayLoc() {
    var awr = "";
    for (var i = 0; i < wrongs.length; i++){
      awr += "<h4 id='question'> A resposta para a pergunta "+(wrongs[i]+1)+ " você pode encontrar aqui: "+ questions[wrongs[i]].answerLocation +"</h4>";
    }
    return awr;
  }

  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
    var score = $('<h3>',{id: 'question'});
    var numCorrect = 0;
    for (var i = 0; i < selections.length; i++) {
      if (selections[i] == questions[i].correctAnswer) {
        numCorrect++;
      }
    }
    if (numCorrect <= 2) {
      var smile = '😔';
    }
    else if (numCorrect == 3) {
      var smile = '😌';
    } else {
      var smile = '😄';
    }
    score.append('Você pontuou ' + numCorrect + ' questões de um total de ' +
                 questions.length + ' corretamente! ' + smile);
    return score;
  }
})();
