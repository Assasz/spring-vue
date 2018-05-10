package api;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Column;
import java.util.Date;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Todo {

    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Integer id;

    private String title;

    @Column(name = "content", length = 500)
    private String content;

    private Date dueDate;

    public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
    }
    
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Date getDueDate() {
        return dueDate;
    }

    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
}