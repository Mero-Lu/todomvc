// 定义存储数据的变量
var todoList = []

var editId = -1

var toggleAll = document.querySelector('#toggle-all')
var clearCompleted = document.querySelector('.footer .clear-completed')
var todoDom = document.querySelector('.main .todo-list')
var footer = document.querySelector('.footer')
var leftItem = document.querySelector('.todo-count strong')
// 每次数据todoList更新，需要重新更新localStorage中的数据
function updateTodo() {
  var jsonStr = JSON.stringify(todoList)
  localStorage.setItem('todoList', jsonStr)
}

//获取localStorage中的数据，渲染到页面中
function renderTodo() {
  var todoJson = localStorage.getItem('todoList') || '[]'
  todoList = JSON.parse(todoJson)
  // 判断当前待办项列表的长度，如果为空则不显示footer

  if (todoList.length == 0) {
    footer.style.display = 'none'
  } else {
    footer.style.display = 'block'
  }

  // 如果todoList中所有待办项都是完成状态，那么全选按钮高亮
  var allStatus = !todoList.some(function(ele, idx) {
    return ele.completed == false
  })
  toggleAll.checked = allStatus

  // 根据待办列表的完成状态，统计footer中未完成的待办项

  var count = 0
  todoList.forEach(function(ele, idx) {
    if (!ele.completed) {
      count++
    }
  })
  if (count == todoList.length) {
    clearCompleted.style.display = 'none'
  } else {
    clearCompleted.style.display = 'block'
  }
  leftItem.innerHTML = count

  var tempStr = template('todo', { list: todoList, editId: editId })
  editId = -1
  todoDom.innerHTML = tempStr
}

renderTodo()

// 添加待办项
var newTodo = document.querySelector('.new-todo')
newTodo.addEventListener('keyup', function(e) {
  if (e.keyCode == 13) {
    // 如果添加的内容为空，则return
    if (!newTodo.value.trim()) return
    // 获取待办列表中最后一项的id，设置当前待办项的id
    // 如果当前没有待办项，则默认id为1

    var todoId = todoList.length > 0 ? todoList[todoList.length - 1].id + 1 : 1

    todoList.push({
      id: todoId,
      title: newTodo.value,
      completed: false
    })

    // 添加成功之后，清空input框
    newTodo.value = ''

    updateTodo()
    renderTodo()
  }
})

// 双击待办项，进入编辑状态
var main = document.querySelector('.main')
main.addEventListener('dblclick', function(e) {
  if (e.target.nodeName == 'LABEL') {
    // 获取当前选中的待办项的id，并赋值给editId
    var label = e.target
    editId = label.dataset.id
    renderTodo()
  }
})

// 更新编辑中的待办项
main.addEventListener('keyup', function(e) {
  if (e.target.className == 'edit' && e.keyCode == 13) {
    // 获取当前编辑中的待办项的id
    var editingId = e.target.dataset.id
    todoList.forEach(function(ele, idx) {
      if (ele.id == editingId) {
        // 更新当前待办项的title属性
        ele.title = e.target.value
      }
    })
    updateTodo()
    renderTodo()
  }
})

// 点击待办项中的checkbox，更新当前待办项的完成状态
// 点击destory按钮，删除当前待办项
main.addEventListener('click', function(e) {
  // 如果当前点击的是.toggle
  var id = e.target.parentNode.parentNode.dataset.id
  if (e.target.className == 'toggle') {
    todoList.forEach(function(ele, idx) {
      if (ele.id == id) {
        ele.completed = e.target.checked
        updateTodo()
        renderTodo()
      }
    })
  }
  // 如果当前点击的是.destroy
  if (e.target.className == 'destroy') {
    todoList.forEach(function(ele, idx) {
      if (ele.id == id) {
        todoList.splice(idx, 1)
        updateTodo()
        renderTodo()
      }
    })
  }
})

// 点击全选按钮，当前待办列表都变成完成状态
toggleAll.addEventListener('click', function() {
  var status = this.checked
  todoList.forEach(function(ele, idx) {
    ele.completed = status
  })
  updateTodo()
  renderTodo()
})

// 点击clearCompleted 按钮，清除当前所有已完成的待办项
clearCompleted.addEventListener('click', function() {
  todoList = todoList.filter(function(ele, idx) {
    if (!ele.completed) {
      return true
    }
  })
  updateTodo()
  renderTodo()
})
