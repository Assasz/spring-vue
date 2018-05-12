package api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Collection;
import java.util.Map;
import java.util.Date;
import javax.validation.Valid;

import api.Todo;
import api.TodoRepository;

@RestController
@CrossOrigin(origins = "*")
public class TodoController {

	@Autowired
    private TodoRepository todoRepository;

    @RequestMapping(value = "/todo", method = RequestMethod.GET)
	public Collection<Todo> list() {
		return this.todoRepository.findAllByOrderByDueDateAsc();
	}

	@RequestMapping(value = "/todo/{id}", method = RequestMethod.GET)
	public Todo get(@PathVariable Integer id) {
		return this.todoRepository.getOne(id);
	}

	@RequestMapping(value = "/todo", method = RequestMethod.POST)
	public ResponseEntity<?> create(@Valid @RequestBody Todo body, Errors errors) {
        if (errors.hasErrors()) {	
            return ResponseEntity.badRequest().body(errors.getAllErrors());
		}

		this.todoRepository.save(body);

		return ResponseEntity.ok(body);
	}

	@RequestMapping(value = "/todo/{id}", method = RequestMethod.PUT)
	public ResponseEntity<?> edit(@PathVariable Integer id, @Valid @RequestBody Todo body, Errors errors) {
        if (errors.hasErrors()) {	
            return ResponseEntity.badRequest().body(errors.getAllErrors());
		}
		
		Todo todo = this.todoRepository.getOne(id);

        todo.setTitle(body.getTitle());
		todo.setContent(body.getContent());
		todo.setDueDate(body.getDueDate());

		this.todoRepository.save(todo);

		return ResponseEntity.ok(todo);
	}

	@RequestMapping(value = "/todo/{id}", method = RequestMethod.DELETE)
	public boolean delete(@PathVariable Integer id) {
		Todo todo = this.todoRepository.getOne(id);

		if(todo != null){
			this.todoRepository.delete(todo);
			return true;
		}

		return false;
	}

	@RequestMapping(value = "/todo/search", method = RequestMethod.POST)
	public Collection<Todo> search(@RequestBody Map<String, String> body) {
		String searchTerm = body.get("searchTerm");
		return this.todoRepository.findByTitleContainingOrContentContainingOrderByDueDateAsc(searchTerm, searchTerm);
	}
}
